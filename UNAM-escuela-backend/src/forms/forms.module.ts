import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsResolver } from './forms.resolver';
import {
  Form,
  FormQuestion,
  FormQuestionOption,
  FormResponse,
  FormAnswer,
} from './entities';
import { Content } from '../contents/entities/content.entity';
import { User } from '../users/entities/user.entity';
import { Activity } from '../activities/entities/activity.entity';
import { UserProgressModule } from '../user-progress/user-progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Form,
      FormQuestion,
      FormQuestionOption,
      FormResponse,
      FormAnswer,
      Content,
      User,
      Activity,
    ]),
    UserProgressModule,
  ],
  providers: [FormsService, FormsResolver],
  exports: [FormsService],
})
export class FormsModule {}