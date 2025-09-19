import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateLevelInput, UpdateLevelInput } from './dto/inputs';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { LevelsFilterArgs } from './dto/args/levels-filter.arg';
import { PaginatedLevels } from './dto/paginated-levels.output';

@Injectable()
export class LevelsService {
  private readonly logger = new Logger(LevelsService.name);

  constructor(
    @InjectRepository(Level)
    private readonly itemsRepository: Repository<Level>,
  ) {}

  async create(
    createLevelInput: CreateLevelInput,
    user?: User,
  ): Promise<Level> {
    // Validar permisos de creación de niveles
    if (user) {
      await this.validateLevelCreationPermissions(
        user,
        createLevelInput.lenguageId,
      );
    }

    const newLevel = this.itemsRepository.create({
      ...createLevelInput,
      calculatedTotalTime: 0, // Inicializar en 0, se calculará automáticamente
    });
    return await this.itemsRepository.save(newLevel);
  }

  async update(
    id: string,
    updateLevelInput: UpdateLevelInput,
    user?: User,
  ): Promise<Level> {
    const level = await this.findOne(id);

    // Validar permisos de actualización de niveles
    if (user) {
      await this.validateLevelCreationPermissions(user, level.lenguageId);
    }

    if (updateLevelInput.name) level.name = updateLevelInput.name;
    if (updateLevelInput.description)
      level.description = updateLevelInput.description;
    if (updateLevelInput.difficulty)
      level.difficulty = updateLevelInput.difficulty;
    return await this.itemsRepository.save(level);
  }

  async remove(id: string, user?: User) {
    const level = await this.findOne(id);

    // Validar permisos de eliminación de niveles
    if (user) {
      await this.validateLevelCreationPermissions(user, level.lenguageId);
    }

    await this.itemsRepository.remove(level);
    return { ...level, id };
  }

  private async validateLevelCreationPermissions(
    user: User,
    languageId: string,
  ): Promise<void> {
    const userHighestRole = this.getHighestRole(user.roles);

    // SuperUsers pueden crear niveles para cualquier idioma
    if (userHighestRole === ValidRoles.superUser) {
      return;
    }

    // Admins solo pueden crear niveles para su idioma asignado
    if (userHighestRole === ValidRoles.admin) {
      if (!user.assignedLanguageId) {
        throw new BadRequestException(
          'Como administrador, necesitas tener un idioma asignado para crear niveles',
        );
      }

      if (user.assignedLanguageId !== languageId) {
        throw new BadRequestException(
          'Solo puedes crear niveles para el idioma que tienes asignado',
        );
      }

      return;
    }

    // Otros roles no pueden crear niveles
    throw new BadRequestException('No tienes permisos para crear niveles');
  }

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
  async findAll(user?: User): Promise<Level[]> {
    // Si es un admin con idioma asignado, solo mostrar niveles de su idioma
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      return await this.itemsRepository.find({
        where: {
          isActive: true,
          lenguageId: user.assignedLanguageId,
        },
      });
    }

    // SuperUsers y otros roles ven todos los niveles
    return await this.itemsRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.itemsRepository.findOneBy({ id });
    if (!level) throw new NotFoundException(`Nivel no encontrado`);
    return level;
  }

  async findByLenguage(lenguageId: string, user?: User): Promise<Level[]> {
    // Validar que el admin solo pueda acceder a niveles de su idioma asignado
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      if (user.assignedLanguageId !== lenguageId) {
        throw new BadRequestException(
          'Solo puedes acceder a niveles del idioma que tienes asignado',
        );
      }
    }

    return await this.itemsRepository.find({
      where: { lenguageId, isActive: true },
    });
  }

  async findPaginated(filters: LevelsFilterArgs): Promise<PaginatedLevels> {
    const { search, page = 1, limit = 5, isActive, lenguageId, difficulty } = filters;
    
    const queryBuilder = this.itemsRepository
      .createQueryBuilder('level')
      .leftJoinAndSelect('level.lenguage', 'lenguage');

    if (search) {
      queryBuilder.andWhere(
        '(level.name ILIKE :search OR level.description ILIKE :search OR lenguage.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('level.isActive = :isActive', { isActive });
    }

    if (lenguageId) {
      queryBuilder.andWhere('level.lenguageId = :lenguageId', { lenguageId });
    }

    if (difficulty) {
      queryBuilder.andWhere('level.difficulty ILIKE :difficulty', { difficulty: `%${difficulty}%` });
    }

    const total = await queryBuilder.getCount();
    const levels = await queryBuilder
      .orderBy('level.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      levels,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  async toggleLevelStatus(id: string): Promise<Level> {
    const level = await this.findOne(id);
    level.isActive = !level.isActive;
    return await this.itemsRepository.save(level);
  }
}
