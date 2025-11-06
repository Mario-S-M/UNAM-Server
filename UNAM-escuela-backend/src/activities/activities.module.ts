import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';
import { Activity } from './entities/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from '../forms/entities/form.entity';
import { FormQuestion } from '../forms/entities/form-question.entity';
import { FormQuestionOption } from '../forms/entities/form-question-option.entity';
import { CommonModule } from '../common/common.module';
import { Content } from '../contents/entities/content.entity';

@Module({
  providers: [ActivitiesResolver, ActivitiesService],
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      Form,
      FormQuestion,
      FormQuestionOption,
      Content,
    ]),
    CommonModule,
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
