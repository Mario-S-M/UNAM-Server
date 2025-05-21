import { Injectable } from '@nestjs/common';
import { CreateHomeworkInput } from './dto/create-homework.input';
import { UpdateHomeworkInput } from './dto/update-homework.input';

@Injectable()
export class HomeworksService {
  create(createHomeworkInput: CreateHomeworkInput) {
    return 'This action adds a new homework';
  }

  findAll() {
    return `This action returns all homeworks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} homework`;
  }

  update(id: number, updateHomeworkInput: UpdateHomeworkInput) {
    return `This action updates a #${id} homework`;
  }

  remove(id: number) {
    return `This action removes a #${id} homework`;
  }
}
