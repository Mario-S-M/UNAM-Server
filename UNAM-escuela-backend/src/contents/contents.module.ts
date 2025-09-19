import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsResolver } from './contents.resolver';
import { Content } from './entities/content.entity';
import { ContentComment } from './entities/content-comment.entity';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [ContentsResolver, ContentsService],
  imports: [
    TypeOrmModule.forFeature([Content, ContentComment, User, Skill]),
    CommonModule,
  ],
  exports: [ContentsService],
})
export class ContentsModule {}
