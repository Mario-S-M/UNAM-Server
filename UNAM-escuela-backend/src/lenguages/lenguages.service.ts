import { Injectable } from '@nestjs/common';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';

@Injectable()
export class LenguagesService {
  create(createLenguageInput: CreateLenguageInput) {
    return 'This action adds a new lenguage';
  }

  findAll() {
    return `This action returns all lenguages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lenguage`;
  }

  update(id: number, updateLenguageInput: UpdateLenguageInput) {
    return `This action updates a #${id} lenguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} lenguage`;
  }
}
