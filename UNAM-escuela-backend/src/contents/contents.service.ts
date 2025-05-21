import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContentsService {

  constructor(
    @InjectRepository(Content)
        private readonly contentsRepository: Repository<Content>,
  ) {}

  async create(createContentInput: CreateContentInput): Promise<Content> {
    const newContent = this.contentsRepository.create(createContentInput);
    return await this.contentsRepository.save(newContent);
  }

  async findAll(): Promise<Content[]> {
    return await this.contentsRepository.find();
  }

  async findByLevel(levelId: string): Promise<Content[]> {
    const contents = await this.contentsRepository.find({where: {levelId: levelId}});
    return contents;
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentsRepository.findOne({ where: { id } });
    if (!content) throw new NotFoundException('Contenido no encontrado');
    return content;
  }

  async update(id: string, updateContentInput: UpdateContentInput): Promise<Content>  {
    const content = await this.findOne(id);
    if (updateContentInput.name) content.name = updateContentInput.name;
    if (updateContentInput.description) content.description = updateContentInput.description;
    return await this.contentsRepository.save(content);
  }

  async remove(id: string) :Promise<Content> {
    const content = await this.findOne(id);
    await this.contentsRepository.remove(content);
    return { ...content, id };
  }
}
