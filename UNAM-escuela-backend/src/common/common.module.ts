import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeCalculationService } from './services/time-calculation.service';
import { Activity } from '../activities/entities/activity.entity';
import { Content } from '../contents/entities/content.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Level } from '../levels/entities/level.entity';
import { Lenguage } from '../lenguages/entities/lenguage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      Content,
      Skill,
      Level,
      Lenguage,
    ]),
  ],
  providers: [TimeCalculationService],
  exports: [TimeCalculationService],
})
export class CommonModule {}