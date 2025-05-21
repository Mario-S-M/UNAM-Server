import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsResolver } from './levels.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';

@Module({
  providers: [LevelsResolver, LevelsService],
  imports: [
    TypeOrmModule.forFeature([Level]),
  ],
})
export class LevelsModule {}
