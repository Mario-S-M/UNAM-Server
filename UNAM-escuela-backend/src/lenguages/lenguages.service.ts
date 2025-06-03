import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Lenguage } from './entities/lenguage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LenguagesService {

  constructor(
    @InjectRepository(Lenguage)
    private readonly lenguageRepository: Repository<Lenguage>,
  ) {}

  create(createLenguageInput: CreateLenguageInput) {
    const newLenguage = this.lenguageRepository.create(createLenguageInput);
    return this.lenguageRepository.save(newLenguage);
  }

  async findAll() : Promise<Lenguage[]> {
    return await this.lenguageRepository.find();
  }

  async findOne(id: string) : Promise<Lenguage> {
    const lenguage = await this.lenguageRepository.findOneBy({ id });
    if (!lenguage) throw new NotFoundException(`Lenguaje no encontrado`);
    return lenguage;
  }

  async update(id: string, updateLenguageInput: UpdateLenguageInput) : Promise<Lenguage> {
    const lenguage = await this.findOne(id);
    if (updateLenguageInput.name) lenguage.name = updateLenguageInput.name;
    return await this.lenguageRepository.save(lenguage);
  }


  async remove(id: string) {
    const lenguage = await this.findOne(id);
    lenguage.isActive = !lenguage.isActive;
    return await this.lenguageRepository.save(lenguage);
  }
}
