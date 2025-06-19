import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsResolver } from './skills.resolver';
import { Skill } from './entities/skill.entity';

@Module({
  providers: [SkillsResolver, SkillsService],
  imports: [TypeOrmModule.forFeature([Skill])],
  exports: [SkillsService],
})
export class SkillsModule {}
