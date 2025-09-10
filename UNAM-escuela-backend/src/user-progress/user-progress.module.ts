import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgressService } from './user-progress.service';
import { UserProgressResolver } from './user-progress.resolver';
import { UserProgress } from './entities/user-progress.entity';
import { UserActivityHistory } from './entities/user-activity-history.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Content } from '../contents/entities/content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProgress,
      UserActivityHistory,
      Activity,
      Content,
    ]),
  ],
  providers: [UserProgressService, UserProgressResolver],
  exports: [UserProgressService],
})
export class UserProgressModule {}