import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { SkillsFilterArgs } from './dto/args/skills-filter.arg';
import { PaginatedSkills } from './dto/paginated-skills.output';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  async create(createSkillInput: CreateSkillInput): Promise<Skill> {
    const newSkill = this.skillsRepository.create({
      ...createSkillInput,
      color: createSkillInput.color || '#3B82F6',
    });
    return await this.skillsRepository.save(newSkill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillsRepository.find({
      relations: ['level', 'lenguage'],
      order: { name: 'ASC' },
    });
  }

  async findActive(): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { isActive: true },
      relations: ['level', 'lenguage'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({
      where: { id },
      relations: ['level', 'lenguage'],
    });
    if (!skill) {
      throw new NotFoundException('Skill no encontrada');
    }
    return skill;
  }

  async findByLevel(levelId: string): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { levelId, isActive: true },
      relations: ['level', 'lenguage'],
      order: { name: 'ASC' },
    });
  }

  async findByLanguage(lenguageId: string): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { lenguageId, isActive: true },
      relations: ['level', 'lenguage'],
      order: { name: 'ASC' },
    });
  }

  async update(id: string, updateSkillInput: UpdateSkillInput): Promise<Skill> {
    const skill = await this.findOne(id);
    Object.assign(skill, updateSkillInput);
    return await this.skillsRepository.save(skill);
  }

  async remove(id: string): Promise<Skill> {
    const skill = await this.findOne(id);
    await this.skillsRepository.remove(skill);
    return { ...skill, id };
  }

  async toggleActive(id: string): Promise<Skill> {
    const skill = await this.findOne(id);
    skill.isActive = !skill.isActive;
    return await this.skillsRepository.save(skill);
  }

  async findPaginated(filters: SkillsFilterArgs): Promise<PaginatedSkills> {
    const { search, page = 1, limit = 10, isActive, levelId, lenguageId } = filters;

    const queryBuilder = this.skillsRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.level', 'level')
      .leftJoinAndSelect('skill.lenguage', 'lenguage');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(skill.name ILIKE :search OR skill.description ILIKE :search OR level.name ILIKE :search OR lenguage.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply active filter
    if (typeof isActive === 'boolean') {
      if (search) {
        queryBuilder.andWhere('skill.isActive = :isActive', { isActive });
      } else {
        queryBuilder.where('skill.isActive = :isActive', { isActive });
      }
    }

    // Apply level filter
    if (levelId) {
      if (search || typeof isActive === 'boolean') {
        queryBuilder.andWhere('skill.levelId = :levelId', { levelId });
      } else {
        queryBuilder.where('skill.levelId = :levelId', { levelId });
      }
    }

    // Apply language filter
    if (lenguageId) {
      if (search || typeof isActive === 'boolean' || levelId) {
        queryBuilder.andWhere('skill.lenguageId = :lenguageId', { lenguageId });
      } else {
        queryBuilder.where('skill.lenguageId = :lenguageId', { lenguageId });
      }
    }

    // Order by language name, level name, then skill name
    queryBuilder.orderBy('lenguage.name', 'ASC')
                .addOrderBy('level.name', 'ASC')
                .addOrderBy('skill.name', 'ASC');

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [skills, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      skills,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }
}
