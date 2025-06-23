import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { Content } from './entities/content.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as mammoth from 'mammoth';
import * as TurndownService from 'turndown';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentsRepository: Repository<Content>,
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

    // Crear el contenido básico
    const newContent = this.contentsRepository.create({
      ...contentData,
      status: contentData.status || 'draft',
      validationStatus: 'sin validar', // Explicitly set as unvalidated
    });

    // Crear la carpeta de markdown
    const markdownPath = await this.createMarkdownStructure(
      contentData.levelId,
      contentData.name,
    );
    newContent.markdownPath = markdownPath;

    // Asignar profesores si se proporcionaron
    if (teacherIds && teacherIds.length > 0) {
      const teachers = await this.usersRepository.findByIds(teacherIds);
      newContent.assignedTeachers = teachers;
    }

    return await this.contentsRepository.save(newContent);
  }

  async findAll(): Promise<Content[]> {
    return await this.contentsRepository.find({
      relations: ['assignedTeachers', 'skill'],
    });
  }

  async findByLevel(levelId: string): Promise<Content[]> {
    const contents = await this.contentsRepository.find({
      where: { levelId: levelId },
      relations: ['assignedTeachers', 'skill'],
    });
    return contents;
  }

  async findByTeacher(teacherId: string): Promise<Content[]> {
    return await this.contentsRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.assignedTeachers', 'teacher')
      .leftJoinAndSelect('content.skill', 'skill')
      .where('teacher.id = :teacherId', { teacherId })
      .getMany();
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentsRepository.findOne({
      where: { id },
      relations: ['assignedTeachers', 'skill'],
    });
    if (!content) throw new NotFoundException('Contenido no encontrado');
    return content;
  }

  async findBySkill(skillId: string): Promise<Content[]> {
    return await this.contentsRepository.find({
      where: { skillId },
      relations: ['assignedTeachers', 'skill'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByLevelAndSkill(
    levelId: string,
    skillId: string,
  ): Promise<Content[]> {
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
  ): Promise<Content> {
    const content = await this.findOne(contentId);
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

  private async createMarkdownStructure(
    levelId: string,
    contentName: string,
  ): Promise<string> {
    try {
      // Obtener información del nivel
      const level = await this.usersRepository.manager
        .createQueryBuilder()
        .select([
          'level.id',
          'level.name',
          'level.description',
          'level.lenguageId',
        ])
        .from('levels', 'level')
        .where('level.id = :levelId', { levelId })
        .getRawOne();

      if (!level) {
        throw new Error('Nivel no encontrado');
      }

      // Obtener información del lenguaje
      const language = await this.usersRepository.manager
        .createQueryBuilder()
        .select(['lenguage.id', 'lenguage.name'])
        .from('lenguages', 'lenguage')
        .where('lenguage.id = :languageId', {
          languageId: level.level_lenguageId,
        })
        .getRawOne();

      if (!language) {
        throw new Error('Lenguaje no encontrado');
      }

      // Sanitizar nombres para uso en rutas
      const sanitizedLanguageName = language.lenguage_name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const sanitizedLevelName = level.level_name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const sanitizedContentName = contentName
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();

      // Crear estructura: /Markdown/[Language]/[Level]/[Content]/ContentName.md
      const markdownDir = join(
        process.cwd(),
        '..',
        'Markdown',
        sanitizedLanguageName,
        sanitizedLevelName,
        sanitizedContentName,
      );

      // Crear la estructura de directorios
      await fs.mkdir(markdownDir, { recursive: true });

      // Crear archivo markdown inicial con formato específico
      const markdownFile = join(markdownDir, `${sanitizedContentName}.md`);
      const initialContent = `# ${contentName}

## Descripción

${level.level_description || 'Contenido pendiente de desarrollo.'}

## Información del Contenido

- **Lenguaje**: ${language.lenguage_name}
- **Nivel**: ${level.level_name}
- **Estado**: Borrador
- **Fecha de creación**: ${new Date().toLocaleDateString('es-ES')}

## Objetivos de Aprendizaje

- [ ] Objetivo 1: Pendiente de definir
- [ ] Objetivo 2: Pendiente de definir
- [ ] Objetivo 3: Pendiente de definir

## Contenido Educativo

*Escribe aquí el contenido educativo...*

### Ejemplo Práctico

*Incluye ejemplos prácticos aquí...*

### Ejercicios

*Agrega ejercicios relacionados...*

## Recursos Adicionales

- [Recurso 1](#)
- [Recurso 2](#)

## Notas para Profesores

*Información específica para los docentes asignados...*
`;

      await fs.writeFile(markdownFile, initialContent, 'utf8');

      return markdownFile;
    } catch (error) {
      console.error('Error creando estructura de markdown:', error);
      throw new Error(
        `No se pudo crear la estructura de archivos: ${error.message}`,
      );
    }
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
      // Si ya existe un markdownPath en la entidad, usarlo
      if (content.markdownPath) {
        const markdownContent = await fs.readFile(content.markdownPath, 'utf8');
        return markdownContent;
      }

      // Si no, intentar construir la ruta basándose en el nombre del contenido
      // Necesitamos obtener información del nivel y lenguaje
      const level = await this.contentsRepository.query(
        'SELECT l.name as level_name, lg.name as language_name FROM levels l JOIN lenguages lg ON l.lenguageId = lg.id WHERE l.id = $1',
        [content.levelId],
      );

      if (!level[0]) {
        throw new Error('No se pudo encontrar información del nivel');
      }

      // Construir ruta basándose en el nombre del contenido
      const sanitizedLanguageName = level[0].language_name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const sanitizedLevelName = level[0].level_name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const sanitizedContentName = content.name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();

      const markdownPath = join(
        process.cwd(),
        '..',
        'Markdown',
        sanitizedLanguageName,
        sanitizedLevelName,
        sanitizedContentName,
        `${sanitizedContentName}.md`,
      );

      // Leer el contenido del archivo
      const markdownContent = await fs.readFile(markdownPath, 'utf8');
      return markdownContent;
    } catch (error) {
      console.error('Error leyendo archivo markdown:', error);
      throw new Error('No se pudo leer el archivo de contenido');
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

    // Verificar que el usuario es un profesor asignado
    const isAssignedTeacher =
      content.assignedTeachers?.some((teacher) => teacher.id === userId) ||
      false;

    if (!isAssignedTeacher) {
      throw new Error('No tienes permisos para editar este contenido');
    }

    try {
      let markdownPath: string;

      // Si ya existe un markdownPath en la entidad, usarlo
      if (content.markdownPath) {
        markdownPath = content.markdownPath;
      } else {
        // Si no, construir la ruta basándose en el nombre del contenido
        const level = await this.contentsRepository.query(
          'SELECT l.name as level_name, lg.name as language_name FROM levels l JOIN lenguages lg ON l.lenguageId = lg.id WHERE l.id = $1',
          [content.levelId],
        );

        if (!level[0]) {
          throw new Error('No se pudo encontrar información del nivel');
        }

        const sanitizedLanguageName = level[0].language_name
          .replace(/[^a-zA-Z0-9]/g, '-')
          .toLowerCase();
        const sanitizedLevelName = level[0].level_name
          .replace(/[^a-zA-Z0-9]/g, '-')
          .toLowerCase();
        const sanitizedContentName = content.name
          .replace(/[^a-zA-Z0-9]/g, '-')
          .toLowerCase();

        markdownPath = join(
          process.cwd(),
          '..',
          'Markdown',
          sanitizedLanguageName,
          sanitizedLevelName,
          sanitizedContentName,
          `${sanitizedContentName}.md`,
        );
      }

      // Asegurar que el directorio existe antes de escribir
      const markdownDir = join(markdownPath, '..');
      await fs.mkdir(markdownDir, { recursive: true });

      // Escribir el contenido al archivo
      await fs.writeFile(markdownPath, markdownContent, 'utf8');

      // Actualizar la fecha de modificación en la base de datos si es necesario
      await this.contentsRepository.update(contentId, {
        updatedAt: new Date().toISOString(),
        markdownPath: content.markdownPath || markdownPath, // Guardar la ruta si no existe
        validationStatus: 'sin validar', // Auto-invalidate when content is edited
      });

      return true;
    } catch (error) {
      console.error('Error escribiendo archivo markdown:', error);
      throw new Error('No se pudo guardar el archivo de contenido');
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
      validationStatus: 'validado',
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
      validationStatus: 'sin validar',
      updatedAt: new Date().toISOString(),
    });

    return this.findOne(contentId);
  }

  // Get only validated content for students and general view
  async findValidatedByLevel(levelId: string): Promise<Content[]> {
    return this.contentsRepository.find({
      where: {
        levelId,
        validationStatus: 'validado',
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
        validationStatus: 'validado',
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
        validationStatus: 'validado',
      },
      relations: ['assignedTeachers', 'skill'],
      order: {
        createdAt: 'DESC',
      },
    });
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
      { validationStatus: 'sin validar' },
      {
        validationStatus: 'validado',
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
        validationStatus: 'validado', // Solo contenido validado es público
      },
    });

    if (!content) {
      throw new NotFoundException('Contenido no encontrado o no está validado');
    }

    try {
      // Si ya existe un markdownPath en la entidad, usarlo
      if (content.markdownPath) {
        const markdownContent = await fs.readFile(content.markdownPath, 'utf8');
        return markdownContent;
      }

      // Si no, intentar construir la ruta basándose en el nombre del contenido
      const level = await this.contentsRepository.query(
        'SELECT l.name as level_name, lg.name as language_name FROM levels l JOIN lenguages lg ON l.lenguageId = lg.id WHERE l.id = $1',
        [content.levelId],
      );

      if (!level[0]) {
        throw new Error('No se pudo encontrar información del nivel');
      }

      // Construir ruta basándose en el nombre del contenido
      const sanitizedLanguageName = level[0].language_name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const sanitizedLevelName = level[0].level_name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const sanitizedContentName = content.name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();

      const markdownPath = join(
        process.cwd(),
        '..',
        'Markdown',
        sanitizedLanguageName,
        sanitizedLevelName,
        sanitizedContentName,
        `${sanitizedContentName}.md`,
      );

      // Leer el contenido del archivo
      const markdownContent = await fs.readFile(markdownPath, 'utf8');
      return markdownContent;
    } catch (error) {
      console.error('Error reading markdown file:', error);
      throw new Error('No se pudo cargar el contenido del archivo');
    }
  }

  // Convert DOCX file to Markdown and update content
  async convertDocxToMarkdown(
    contentId: string,
    docxBuffer: Buffer,
    userId: string,
  ): Promise<boolean> {
    console.log('🔄 Starting DOCX conversion process...');
    console.log('📋 Content ID:', contentId);
    console.log('👤 User ID:', userId);
    console.log('📄 Buffer size:', docxBuffer.length, 'bytes');

    // Verificar que el contenido existe y el usuario tiene acceso
    console.log('🔍 Looking for content in database...');
    const content = await this.contentsRepository.findOne({
      where: { id: contentId },
      relations: ['assignedTeachers'],
    });

    if (!content) {
      console.error('❌ Content not found');
      throw new NotFoundException('Contenido no encontrado');
    }
    console.log('✅ Content found:', content.name);
    console.log(
      '👥 Assigned teachers:',
      content.assignedTeachers?.map((t) => t.id),
    );

    // Verificar que el usuario es un profesor asignado
    const isAssignedTeacher =
      content.assignedTeachers?.some((teacher) => teacher.id === userId) ||
      false;

    console.log(
      '🔐 Permission check - Is assigned teacher:',
      isAssignedTeacher,
    );

    if (!isAssignedTeacher) {
      console.error('❌ User not authorized');
      throw new Error('No tienes permisos para editar este contenido');
    }

    try {
      // Convert DOCX to HTML using mammoth
      console.log('🔧 Converting DOCX to HTML using mammoth...');
      const result = await mammoth.convertToHtml({ buffer: docxBuffer });
      console.log('✅ DOCX to HTML conversion completed');
      console.log('📏 HTML length:', result.value.length);
      console.log('⚠️ Conversion messages:', result.messages.length);

      if (result.messages.length > 0) {
        console.log('📝 Conversion warnings:', result.messages);
      }

      // Convert HTML to Markdown using turndown
      console.log('🔧 Converting HTML to Markdown using turndown...');
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
        emDelimiter: '*',
        strongDelimiter: '**',
      });

      // Add custom rules for better markdown conversion
      turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike'],
        replacement: function (content) {
          return '~~' + content + '~~';
        },
      });

      const markdown = turndownService.turndown(result.value);
      console.log('✅ HTML to Markdown conversion completed');
      console.log('📏 Markdown length:', markdown.length);

      // Use only the converted markdown content without any additional headers
      // This will replace ALL existing content in the editor
      const finalMarkdown = markdown;
      console.log(
        '📄 Final markdown prepared (original content only), length:',
        finalMarkdown.length,
      );

      // Update the content using existing method
      console.log('💾 Updating markdown content...');
      const success = await this.updateMarkdownContent(
        contentId,
        finalMarkdown,
        userId,
      );

      console.log('✅ Update result:', success);

      if (success) {
        console.log('🎉 DOCX successfully converted and saved as markdown');
      } else {
        console.log('⚠️ Update returned false');
      }

      return success;
    } catch (error) {
      console.error('💥 Error converting DOCX to markdown:', error);
      console.error('Stack trace:', error.stack);
      throw new Error('No se pudo convertir el archivo Word a Markdown');
    }
  }
}
