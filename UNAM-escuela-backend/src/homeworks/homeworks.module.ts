import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { HomeworksResolver } from './homeworks.resolver';

@Module({
  providers: [HomeworksResolver, HomeworksService],
})
export class HomeworksModule {}
