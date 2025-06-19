import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelInput, UpdateLevelInput } from './dto/inputs';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly itemsRepository: Repository<Level>,
  ) {}

  async create(createLevelInput: CreateLevelInput): Promise<Level> {
    const newLevel = this.itemsRepository.create(createLevelInput);
    return await this.itemsRepository.save(newLevel);
  }
  async findAll(): Promise<Level[]> {
    return await this.itemsRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.itemsRepository.findOneBy({ id });
    if (!level) throw new NotFoundException(`Nivel no encontrado`);
    return level;
  }
  async findByLenguage(lenguageId: string): Promise<Level[]> {
    return await this.itemsRepository.find({
      where: { lenguageId, isActive: true },
    });
  }

  async update(id: string, updateLevelInput: UpdateLevelInput): Promise<Level> {
    const level = await this.findOne(id);
    if (updateLevelInput.name) level.name = updateLevelInput.name;
    if (updateLevelInput.description)
      level.description = updateLevelInput.description;
    if (updateLevelInput.difficulty)
      level.difficulty = updateLevelInput.difficulty;
    return await this.itemsRepository.save(level);
  }

  async remove(id: string) {
    const level = await this.findOne(id);
    await this.itemsRepository.remove(level);
    return { ...level, id };
  }
}
