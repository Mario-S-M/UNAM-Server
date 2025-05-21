import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';
import { Activity } from './entities/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ActivitiesResolver, ActivitiesService],
  imports: [TypeOrmModule.forFeature([Activity]),],
})
export class ActivitiesModule {}
