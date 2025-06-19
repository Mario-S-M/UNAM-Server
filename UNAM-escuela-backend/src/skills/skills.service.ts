import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
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
      order: { name: 'ASC' },
    });
  }

  async findActive(): Promise<Skill[]> {
    return await this.skillsRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({
      where: { id },
    });
    if (!skill) {
      throw new NotFoundException('Skill no encontrada');
    }
    return skill;
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
}
