import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';
import { LenguagesFilterArgs } from './dto/args/lenguages-filter.arg';
import { PaginatedLenguages } from './dto/paginated-lenguages.output';
import { InjectRepository } from '@nestjs/typeorm';
import { Lenguage } from './entities/lenguage.entity';
import { Level } from '../levels/entities/level.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class LenguagesService {
  constructor(
    @InjectRepository(Lenguage)
    private readonly lenguageRepository: Repository<Lenguage>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  create(createLenguageInput: CreateLenguageInput) {
    const newLenguage = this.lenguageRepository.create({
      ...createLenguageInput,
      calculatedTotalTime: 0, // Inicializar en 0, se calculará automáticamente
    });
    return this.lenguageRepository.save(newLenguage);
  }
  async findActive(): Promise<Lenguage[]> {
    return await this.lenguageRepository.find({
      where: {
        isActive: true,
      },
    });
  }

  async findFeatured(): Promise<Lenguage[]> {
    return await this.lenguageRepository.find({
      where: {
        featured: true,
        isActive: true,
      },
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }

  async findByNivel(nivel: string): Promise<Lenguage[]> {
    return await this.lenguageRepository.find({
      where: {
        nivel: nivel as any,
        isActive: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findAll(): Promise<Lenguage[]> {
    return await this.lenguageRepository.find();
  }

  async findOne(id: string): Promise<Lenguage> {
    const lenguage = await this.lenguageRepository.findOneBy({ id });
    if (!lenguage) throw new NotFoundException(`Lenguaje no encontrado`);
    return lenguage;
  }

  async update(
    id: string,
    updateLenguageInput: UpdateLenguageInput,
  ): Promise<Lenguage> {
    const lenguage = await this.findOne(id);

    // Actualizar campos principales
    if (updateLenguageInput.name !== undefined)
      lenguage.name = updateLenguageInput.name;
    if (updateLenguageInput.eslogan_atractivo !== undefined)
      lenguage.eslogan_atractivo = updateLenguageInput.eslogan_atractivo;
    if (updateLenguageInput.descripcion_corta !== undefined)
      lenguage.descripcion_corta = updateLenguageInput.descripcion_corta;
    if (updateLenguageInput.descripcion_completa !== undefined)
      lenguage.descripcion_completa = updateLenguageInput.descripcion_completa;
    if (updateLenguageInput.nivel !== undefined)
      lenguage.nivel = updateLenguageInput.nivel;
    if (updateLenguageInput.duracion_total_horas !== undefined)
      lenguage.duracion_total_horas = updateLenguageInput.duracion_total_horas;
    if (updateLenguageInput.color_tema !== undefined)
      lenguage.color_tema = updateLenguageInput.color_tema;
    if (updateLenguageInput.icono_curso !== undefined)
      lenguage.icono_curso = updateLenguageInput.icono_curso;
    if (updateLenguageInput.imagen_hero !== undefined)
      lenguage.imagen_hero = updateLenguageInput.imagen_hero;
    if (updateLenguageInput.badge_destacado !== undefined)
      lenguage.badge_destacado = updateLenguageInput.badge_destacado;

    if (updateLenguageInput.idioma_origen !== undefined)
      lenguage.idioma_origen = updateLenguageInput.idioma_origen;
    if (updateLenguageInput.idioma_destino !== undefined)
      lenguage.idioma_destino = updateLenguageInput.idioma_destino;
    if (updateLenguageInput.certificado_digital !== undefined)
      lenguage.certificado_digital = updateLenguageInput.certificado_digital;
    if (updateLenguageInput.puntuacion_promedio !== undefined)
      lenguage.puntuacion_promedio = updateLenguageInput.puntuacion_promedio;
    if (updateLenguageInput.total_estudiantes_inscritos !== undefined)
      lenguage.total_estudiantes_inscritos =
        updateLenguageInput.total_estudiantes_inscritos;
    if (updateLenguageInput.estado !== undefined)
      lenguage.estado = updateLenguageInput.estado;
    if (updateLenguageInput.featured !== undefined)
      lenguage.featured = updateLenguageInput.featured;

    // Campos legacy
    if (updateLenguageInput.icons !== undefined)
      lenguage.icons = updateLenguageInput.icons;

    return await this.lenguageRepository.save(lenguage);
  }

  async remove(id: string) {
    const lenguage = await this.findOne(id);

    // Verificar si existen niveles asociados a este idioma
    const associatedLevels = await this.levelRepository.count({
      where: { lenguageId: id },
    });

    if (associatedLevels > 0) {
      throw new BadRequestException(
        `No se puede eliminar el idioma "${lenguage.name}" porque tiene ${associatedLevels} nivel(es) asociado(s). Elimine primero los niveles o desactive el idioma.`,
      );
    }

    // Guardar una copia antes de eliminar
    const deletedLanguage = { ...lenguage };
    // Borrado completo de la base de datos
    await this.lenguageRepository.remove(lenguage);
    return deletedLanguage;
  }

  async toggleLanguageStatus(id: string) {
    const lenguage = await this.findOne(id);
    lenguage.isActive = !lenguage.isActive;
    return await this.lenguageRepository.save(lenguage);
  }

  async findPaginated(
    filters: LenguagesFilterArgs,
  ): Promise<PaginatedLenguages> {
    const { search, page = 1, limit = 5, isActive } = filters;

    const queryBuilder = this.lenguageRepository.createQueryBuilder('lenguage');

    // Apply search filter
    if (search) {
      queryBuilder.where('(lenguage.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Apply active filter
    if (typeof isActive === 'boolean') {
      if (search) {
        queryBuilder.andWhere('lenguage.isActive = :isActive', { isActive });
      } else {
        queryBuilder.where('lenguage.isActive = :isActive', { isActive });
      }
    }

    // Order by name
    queryBuilder.orderBy('lenguage.name', 'ASC');

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [lenguages, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      lenguages,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  private getHighestRole(roles: string[]): ValidRoles {
    const roleHierarchy: Record<ValidRoles, number> = {
      [ValidRoles.superUser]: 5,
      [ValidRoles.admin]: 4,
      [ValidRoles.docente]: 3,
      [ValidRoles.alumno]: 2,
      [ValidRoles.mortal]: 1,
    };

    let highest: ValidRoles = ValidRoles.mortal;
    for (const role of roles) {
      const currentRoleValue = roleHierarchy[role as ValidRoles] || 0;
      const highestRoleValue = roleHierarchy[highest] || 0;
      if (currentRoleValue > highestRoleValue) {
        highest = role as ValidRoles;
      }
    }
    return highest;
  }
}
