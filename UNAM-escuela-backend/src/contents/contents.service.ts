import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { CreateContentCommentInput } from './dto/create-content-comment.input';
import { UpdateContentCommentInput } from './dto/update-content-comment.input';
import { Content } from './entities/content.entity';
import { ContentComment } from './entities/content-comment.entity';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as mammoth from 'mammoth';
import * as TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm';
import { PaginatedContents } from './dto/paginated-contents.output';
import { ContentsFilterArgs } from './dto/args/contents-filter.arg';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentsRepository: Repository<Content>,
    @InjectRepository(ContentComment)
    private readonly contentCommentsRepository: Repository<ContentComment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createContentInput: CreateContentInput): Promise<Content> {
    const { teacherIds, ...contentData } = createContentInput;

    // Verificar que no existe contenido duplicado en el mismo nivel
    const existingContent = await this.contentsRepository.findOne({
      where: {
        name: contentData.name,
        levelId: contentData.levelId,
      },
    });

    if (existingContent) {
      throw new Error(
        `Ya existe un contenido con el nombre "${contentData.name}" en este nivel`,
      );
    }

    // Crear el contenido básico con contenido JSON inicial
    const initialJsonContent = `[{"type":"h1","children":[{"text":"Título: Contenido ${contentData.name}"}]},{"type":"p","children":[{"text":""}]}]`;
    
    const newContent = this.contentsRepository.create({
      ...contentData,
      jsonContent: initialJsonContent,
      validationStatus: 'sin validar', // Explicitly set as unvalidated
    });

    // Asignar profesores si se proporcionaron
    if (teacherIds && teacherIds.length > 0) {
      const teachers = await this.usersRepository.findByIds(teacherIds);
      newContent.assignedTeachers = teachers;
    }

    return await this.contentsRepository.save(newContent);
  }

  async findAll(): Promise<Content[]> {
    return await this.contentsRepository.find({
      relations: ['assignedTeachers', 'skill', 'level', 'language'],
    });
  }

  async findAllPublic(
    languageId?: string,
    levelId?: string,
    skillId?: string,
  ): Promise<Content[]> {
    let queryBuilder = this.contentsRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.assignedTeachers', 'assignedTeachers')
      .leftJoinAndSelect('content.skill', 'skill');

    // Apply filters
    if (levelId) {
      queryBuilder = queryBuilder.andWhere('content.levelId = :levelId', { levelId });
    }

    if (skillId) {
      queryBuilder = queryBuilder.andWhere('content.skillId = :skillId', { skillId });
    }

    // For language filtering, filter by skill's language
    if (languageId) {
      queryBuilder = queryBuilder
        .leftJoin('content.skill', 'contentSkill')
        .leftJoin('contentSkill.lenguage', 'skillLanguage')
        .andWhere('skillLanguage.id = :languageId', { languageId });
    }

    return queryBuilder
      .orderBy('content.createdAt', 'DESC')
      .getMany();
  }

  async findPaginated(
    filters: ContentsFilterArgs,
    user?: User,
  ): Promise<PaginatedContents> {
    const {
      search,
      levelId,
      skillId,
      validationStatus,
      page = 1,
      limit = 5,
    } = filters;

    let query = this.contentsRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.assignedTeachers', 'assignedTeachers')
      .leftJoinAndSelect('content.skill', 'skill')
      .leftJoinAndSelect('content.level', 'level')
      .leftJoinAndSelect('content.language', 'language');

    // Apply filters based on user permissions
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      // Admin with assigned language: filter contents by their assigned language
      const levels = await this.usersRepository.manager
        .createQueryBuilder()
        .select(['level.id'])
        .from('levels', 'level')
        .where('level.lenguageId = :languageId', {
          languageId: user.assignedLanguageId,
        })
        .getRawMany();

      const levelIds = levels.map((level) => level.level_id);

      if (levelIds.length === 0) {
        return {
          contents: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      query = query.andWhere('content.levelId IN (:...levelIds)', { levelIds });
    }

    // Filter by level if specified
    if (levelId) {
      query = query.andWhere('content.levelId = :levelId', { levelId });
    }

    // Filter by skill if specified
    if (skillId) {
      query = query.andWhere('content.skillId = :skillId', { skillId });
    }

    // Filter by validation status if specified
    if (validationStatus) {
      query = query.andWhere('content.validationStatus = :validationStatus', {
        validationStatus,
      });
    }

    // Filter by search if specified
    if (search && search.trim()) {
      query = query.andWhere(
        '(LOWER(content.name) LIKE LOWER(:search) OR LOWER(content.description) LIKE LOWER(:search))',
        { search: `%${search.trim()}%` },
      );
    }

    // Order by creation date (newest first)
    query = query.orderBy('content.createdAt', 'DESC');

    // Get total count
    const total = await query.getCount();

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.skip(offset).take(limit);

    // Get contents
    const contents = await query.getMany();

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      contents,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }



  async findByLevel(levelId: string, user?: User): Promise<Content[]> {
    // Validar que el admin solo pueda acceder a contenidos de su idioma asignado
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      // Obtener el idioma del nivel
      const level = await this.usersRepository.manager
        .createQueryBuilder()
        .select(['level.lenguageId'])
        .from('levels', 'level')
        .where('level.id = :levelId', { levelId })
        .getRawOne();

      if (!level) {
        throw new BadRequestException('Nivel no encontrado');
      }

      // Verificar que el nivel pertenece al idioma asignado del admin
      if (level.level_lenguageId !== user.assignedLanguageId) {
        throw new BadRequestException(
          'Solo puedes acceder a contenidos del idioma que tienes asignado',
        );
      }
    }

    const contents = await this.contentsRepository.find({
      where: { levelId: levelId },
      relations: ['assignedTeachers', 'skill', 'level', 'language'],
    });
    return contents;
  }

  async findByTeacher(teacherId: string): Promise<Content[]> {
    console.log('🔍 findByTeacher called with teacherId:', teacherId);
    const contents = await this.contentsRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.assignedTeachers', 'teacher')
      .leftJoinAndSelect('content.skill', 'skill')
      .where('teacher.id = :teacherId', { teacherId })
      .getMany();

    console.log('🔍 findByTeacher found contents:', contents.length);
    return contents;
  }

  async findOne(id: string, user?: User): Promise<Content> {
    console.log('🔍 ContentsService.findOne - Called with:', {
      id,
      user: user ? { id: user.id, roles: user.roles } : null,
    });

    const content = await this.contentsRepository.findOne({
      where: { id },
      relations: ['assignedTeachers', 'skill'],
    });

    console.log('🔍 ContentsService.findOne - Content found:', !!content);

    if (!content) throw new NotFoundException('Contenido no encontrado');

    // Access control: Teachers can only access content they are assigned to
    if (user && this.getHighestRole(user.roles) === ValidRoles.docente) {
      console.log(
        '🔍 ContentsService.findOne - User is teacher, checking assignment',
      );

      const isAssignedTeacher = content.assignedTeachers?.some(
        (teacher) => teacher.id === user.id,
      );

      console.log(
        '🔍 ContentsService.findOne - Is assigned teacher:',
        isAssignedTeacher,
      );
      console.log(
        '🔍 ContentsService.findOne - Assigned teachers:',
        content.assignedTeachers?.map((t) => ({ id: t.id, name: t.fullName })),
      );

      if (!isAssignedTeacher) {
        console.log(
          '🔍 ContentsService.findOne - Access denied, teacher not assigned to content',
        );
        throw new NotFoundException('Contenido no encontrado');
      }
    }

    console.log(
      '🔍 ContentsService.findOne - Access granted, returning content',
    );
    return content;
  }

  async findBySkill(skillId: string, user?: User): Promise<Content[]> {
    // Si es admin con idioma asignado, filtrar contenidos por idioma
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      // Obtener todos los niveles del idioma asignado del admin
      const levels = await this.usersRepository.manager
        .createQueryBuilder()
        .select(['level.id'])
        .from('levels', 'level')
        .where('level.lenguageId = :languageId', {
          languageId: user.assignedLanguageId,
        })
        .getRawMany();

      const levelIds = levels.map((level) => level.level_id);

      if (levelIds.length === 0) {
        return []; // No hay niveles para este idioma
      }

      return await this.contentsRepository
        .createQueryBuilder('content')
        .leftJoinAndSelect('content.assignedTeachers', 'teachers')
        .leftJoinAndSelect('content.skill', 'skill')
        .where('content.skillId = :skillId', { skillId })
        .andWhere('content.levelId IN (:...levelIds)', { levelIds })
        .orderBy('content.createdAt', 'DESC')
        .getMany();
    }

    return await this.contentsRepository.find({
      where: { skillId },
      relations: ['assignedTeachers', 'skill'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByLevelAndSkill(
    levelId: string,
    skillId: string,
    user?: User,
  ): Promise<Content[]> {
    // Validar que el admin solo pueda acceder a contenidos de su idioma asignado
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      // Obtener el idioma del nivel
      const level = await this.usersRepository.manager
        .createQueryBuilder()
        .select(['level.lenguageId'])
        .from('levels', 'level')
        .where('level.id = :levelId', { levelId })
        .getRawOne();

      if (!level) {
        throw new BadRequestException('Nivel no encontrado');
      }

      // Verificar que el nivel pertenece al idioma asignado del admin
      if (level.level_lenguageId !== user.assignedLanguageId) {
        throw new BadRequestException(
          'Solo puedes acceder a contenidos del idioma que tienes asignado',
        );
      }
    }

    return await this.contentsRepository.find({
      where: { levelId, skillId },
      relations: ['assignedTeachers', 'skill'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateContentInput: UpdateContentInput,
  ): Promise<Content> {
    const { teacherIds, ...updateData } = updateContentInput;
    const content = await this.findOne(id);

    // Actualizar campos básicos
    Object.assign(content, updateData);

    // Actualizar profesores asignados si se proporcionaron
    if (teacherIds !== undefined) {
      if (teacherIds.length > 0) {
        const teachers = await this.usersRepository.findByIds(teacherIds);
        content.assignedTeachers = teachers;
      } else {
        content.assignedTeachers = [];
      }
    }

    return await this.contentsRepository.save(content);
  }

  async assignTeachers(
    contentId: string,
    teacherIds: string[],
    user?: User,
  ): Promise<Content> {
    const content = await this.findOne(contentId);

    // Validar restricciones de idioma para la asignación de profesores
    if (user && teacherIds.length > 0) {
      await this.validateTeacherAssignmentPermissions(
        contentId,
        teacherIds,
        user,
      );
    }

    const teachers = await this.usersRepository.findByIds(teacherIds);
    content.assignedTeachers = teachers;
    return await this.contentsRepository.save(content);
  }

  async removeTeacher(contentId: string, teacherId: string): Promise<Content> {
    const content = await this.findOne(contentId);
    content.assignedTeachers =
      content.assignedTeachers?.filter((teacher) => teacher.id !== teacherId) ||
      [];
    return await this.contentsRepository.save(content);
  }

  async remove(id: string): Promise<Content> {
    const content = await this.findOne(id);
    await this.contentsRepository.remove(content);
    return { ...content, id };
  }



  async getMarkdownContent(contentId: string, userId: string): Promise<string> {
    // Verificar que el contenido existe y el usuario tiene acceso
    const content = await this.contentsRepository.findOne({
      where: { id: contentId },
      relations: ['assignedTeachers'],
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    // Verificar que el usuario es un profesor asignado o admin
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isAssignedTeacher =
      content.assignedTeachers?.some((teacher) => teacher.id === userId) ||
      false;
    const isAdmin =
      user.roles.includes('admin') || user.roles.includes('superUser');

    if (!isAssignedTeacher && !isAdmin) {
      throw new Error('No tienes permisos para acceder a este contenido');
    }

    try {
      // Retornar el contenido JSON desde la base de datos
      if (content.jsonContent) {
        return content.jsonContent;
      }

      // Si no hay contenido JSON, retornar contenido inicial
      const initialContent = `[{"type":"h1","children":[{"text":"Título: Contenido ${content.name}"}]},{"type":"p","children":[{"text":""}]}]`;
      return initialContent;
    } catch (error) {
      console.error('Error reading content:', error);
      throw new Error('No se pudo leer el contenido');
    }
  }

  async updateMarkdownContent(
    contentId: string,
    markdownContent: string,
    userId: string,
  ): Promise<boolean> {
    // Verificar que el contenido existe y el usuario tiene acceso
    const content = await this.contentsRepository.findOne({
      where: { id: contentId },
      relations: ['assignedTeachers'],
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    // Verificar que el usuario es un profesor asignado o admin
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isAssignedTeacher =
      content.assignedTeachers?.some((teacher) => teacher.id === userId) ||
      false;
    const isAdmin =
      user.roles.includes('admin') || user.roles.includes('superUser');

    if (!isAssignedTeacher && !isAdmin) {
      throw new Error('No tienes permisos para editar este contenido');
    }

    try {
      // Guardar el contenido JSON directamente en la base de datos
      await this.contentsRepository.update(contentId, {
        jsonContent: markdownContent,
        updatedAt: new Date().toISOString(),
        validationStatus: 'sin validar', // Auto-invalidate when content is edited
      });

      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      throw new Error('No se pudo guardar el contenido');
    }
  }

  // Validate content - only for admins
  async validateContent(contentId: string): Promise<Content> {
    const content = await this.contentsRepository.findOne({
      where: { id: contentId },
      relations: ['assignedTeachers', 'skill'],
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    await this.contentsRepository.update(contentId, {
      validationStatus: 'APPROVED',
      updatedAt: new Date().toISOString(),
    });

    return this.findOne(contentId);
  }

  // Mark content as requiring validation - for admins
  async invalidateContent(contentId: string): Promise<Content> {
    const content = await this.contentsRepository.findOne({
      where: { id: contentId },
      relations: ['assignedTeachers', 'skill'],
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    await this.contentsRepository.update(contentId, {
      validationStatus: 'PENDING',
      updatedAt: new Date().toISOString(),
    });

    return this.findOne(contentId);
  }

  // Get only validated content for students and general view
  async findValidatedByLevel(levelId: string): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        levelId,
        validationStatus: 'APPROVED',
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Get only validated content by skill
  async findValidatedBySkill(skillId: string): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        skillId,
        validationStatus: 'APPROVED',
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Get only validated content by level and skill
  async findValidatedByLevelAndSkill(
    levelId: string,
    skillId: string,
  ): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        levelId,
        skillId,
        validationStatus: 'APPROVED',
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Get single validated content for public access
  async findOnePublic(id: string): Promise<Content> {
    const content = await this.contentsRepository.findOne({
      where: {
        id,
        validationStatus: 'APPROVED',
      },
      relations: ['assignedTeachers', 'skill'],
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado o no está validado');
    }

    return content;
  }

  // TEMPORARY: Public access methods that return ALL content (not just validated)
  // TODO: Remove these methods once all content is properly validated
  async findAllByLevelPublic(levelId: string): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        levelId,
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // TEMPORARY: Get all content by skill for public access
  async findAllBySkillPublic(skillId: string): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        skillId,
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // TEMPORARY: Get all content by level and skill for public access
  async findAllByLevelAndSkillPublic(
    levelId: string,
    skillId: string,
  ): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        levelId,
        skillId,
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Administrative function to validate all content at once
  async validateAllContent(): Promise<{
    message: string;
    updatedCount: number;
  }> {
    const result = await this.contentsRepository.update(
      { validationStatus: 'PENDING' },
      {
        validationStatus: 'APPROVED',
        updatedAt: new Date().toISOString(),
      },
    );

    return {
      message: 'All content has been validated',
      updatedCount: result.affected || 0,
    };
  }

  // Public access to markdown content for validated content only
  async getMarkdownContentPublic(contentId: string): Promise<string> {
    // Verificar que el contenido existe y está validado
    const content = await this.contentsRepository.findOne({
      where: {
        id: contentId,
        validationStatus: 'APPROVED', // Solo contenido validado es público
      },
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado o no está validado');
    }

    try {
      // Retornar el contenido JSON desde la base de datos
      if (content.jsonContent) {
        return content.jsonContent;
      }

      // Si no hay contenido JSON, retornar contenido inicial
      const initialContent = `[{"type":"h1","children":[{"text":"Título: Contenido ${content.name}"}]},{"type":"p","children":[{"text":""}]}]`;
      return initialContent;
    } catch (error) {
      console.error('Error reading public content:', error);
      throw new Error('No se pudo cargar el contenido');
    }
  }

  // Convert DOCX file to Markdown and update content
  async convertDocxToMarkdown(
    contentId: string,
    docxBuffer: Buffer,
    userId: string,
  ): Promise<boolean> {
    // Verificar que el contenido existe y el usuario tiene acceso
    const content = await this.contentsRepository.findOne({
      where: { id: contentId },
      relations: ['assignedTeachers'],
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    // Verificar que el usuario es un profesor asignado o admin
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isAssignedTeacher =
      content.assignedTeachers?.some((teacher) => teacher.id === userId) ||
      false;
    const isAdmin =
      user.roles.includes('admin') || user.roles.includes('superUser');

    if (!isAssignedTeacher && !isAdmin) {
      throw new Error('No tienes permisos para editar este contenido');
    }

    try {
      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ buffer: docxBuffer });

      // Convert HTML to Markdown using turndown
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
        emDelimiter: '*',
        strongDelimiter: '**',
      });

      // Custom table rule to handle Word tables with paragraphs in cells
      turndownService.addRule('table', {
        filter: 'table',
        replacement: function (content, node: any) {
          const rows = Array.from(node.querySelectorAll('tr'));
          let result = '\n\n';

          rows.forEach((row: any, index: number) => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            const cellContents = cells.map((cell: any) => {
              // Extract text from paragraphs and other elements inside the cell
              const paragraphs = cell.querySelectorAll('p');
              if (paragraphs.length > 0) {
                return Array.from(paragraphs)
                  .map((p: any) => p.textContent.trim())
                  .filter((text: string) => text.length > 0)
                  .join(' ');
              }
              return cell.textContent.trim().replace(/\s+/g, ' ');
            });

            // Create the row
            result += '| ' + cellContents.join(' | ') + ' |\n';

            // Add separator after the first row (headers)
            if (index === 0) {
              result +=
                '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
            }
          });

          return result + '\n';
        },
      });

      // Add custom rules for better markdown conversion
      turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike'],
        replacement: function (content) {
          return '~~' + content + '~~';
        },
      });

      const markdown = turndownService.turndown(result.value);

      // Use only the converted markdown content without any additional headers
      // This will replace ALL existing content in the editor
      const finalMarkdown = markdown;

      // Update the content using existing method
      const success = await this.updateMarkdownContent(
        contentId,
        finalMarkdown,
        userId,
      );

      return success;
    } catch (error) {
      throw new Error('No se pudo convertir el archivo Word a Markdown');
    }
  }

  /**
   * Validates teacher assignment permissions based on language restrictions
   */
  private async validateTeacherAssignmentPermissions(
    contentId: string,
    teacherIds: string[],
    user: User,
  ): Promise<void> {
    const userHighestRole = this.getHighestRole(user.roles);

    // SuperUsers pueden asignar cualquier profesor
    if (userHighestRole === ValidRoles.superUser) {
      return;
    }

    // Para admins con idioma asignado, validar compatibilidad de idioma
    if (userHighestRole === ValidRoles.admin && user.assignedLanguageId) {
      // Obtener el idioma del contenido a través de su nivel
      const content = await this.contentsRepository.findOne({
        where: { id: contentId },
        select: ['levelId'],
      });

      if (!content) {
        throw new BadRequestException('Contenido no encontrado');
      }

      // Obtener el idioma del nivel
      const level = await this.usersRepository.manager
        .createQueryBuilder()
        .select(['level.lenguageId'])
        .from('levels', 'level')
        .where('level.id = :levelId', { levelId: content.levelId })
        .getRawOne();

      if (!level) {
        throw new BadRequestException('Nivel no encontrado');
      }

      // Verificar que el contenido pertenece al idioma asignado del admin
      if (level.level_lenguageId !== user.assignedLanguageId) {
        throw new BadRequestException(
          'Solo puedes asignar profesores a contenido de tu idioma asignado',
        );
      }

      // Para futuras implementaciones: aquí podríamos validar que los profesores
      // también tengan compatibilidad con el idioma específico
      // Por ahora, permitir la asignación si el admin tiene permisos sobre el contenido
    }
  }

  /**
   * Gets the highest role from user roles array
   */
  private getHighestRole(roles: string[]): ValidRoles {
    const roleHierarchy = {
      superUser: 5,
      admin: 4,
      docente: 3,
      alumno: 2,
      mortal: 1,
    };

    let highestRole = ValidRoles.mortal;
    let highestLevel = 0;

    for (const role of roles) {
      const level = roleHierarchy[role as ValidRoles] || 0;
      if (level > highestLevel) {
        highestLevel = level;
        highestRole = role as ValidRoles;
      }
    }

    return highestRole;
  }

  // Métodos para comentarios
  async createComment(
    createCommentInput: CreateContentCommentInput,
    authorId: string,
  ): Promise<ContentComment> {
    // Verificar que el contenido existe
    const content = await this.contentsRepository.findOne({
      where: { id: createCommentInput.contentId },
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    const comment = this.contentCommentsRepository.create({
      ...createCommentInput,
      authorId,
    });

    return await this.contentCommentsRepository.save(comment);
  }

  async getCommentsByContent(contentId: string): Promise<ContentComment[]> {
    return await this.contentCommentsRepository.find({
      where: { contentId },
      relations: ['author', 'content'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateComment(
    updateCommentInput: UpdateContentCommentInput,
    authorId: string,
  ): Promise<ContentComment> {
    const comment = await this.contentCommentsRepository.findOne({
      where: { id: updateCommentInput.id },
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Solo el autor puede editar su comentario
    if (comment.authorId !== authorId) {
      throw new BadRequestException('No tienes permisos para editar este comentario');
    }

    await this.contentCommentsRepository.update(
      updateCommentInput.id,
      { comment: updateCommentInput.comment },
    );

    const updatedComment = await this.contentCommentsRepository.findOne({
      where: { id: updateCommentInput.id },
      relations: ['author', 'content'],
    });

    if (!updatedComment) {
      throw new NotFoundException('Comentario actualizado no encontrado');
    }

    return updatedComment;
  }

  async deleteComment(commentId: string, authorId: string): Promise<boolean> {
    const comment = await this.contentCommentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Solo el autor puede eliminar su comentario
    if (comment.authorId !== authorId) {
      throw new BadRequestException('No tienes permisos para eliminar este comentario');
    }

    await this.contentCommentsRepository.delete(commentId);
    return true;
  }
}
