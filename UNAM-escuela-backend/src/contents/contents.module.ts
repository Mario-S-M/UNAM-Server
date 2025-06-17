import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsResolver } from './contents.resolver';
import { Content } from './entities/content.entity';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ContentsResolver, ContentsService],
  imports: [TypeOrmModule.forFeature([Content, User])],
  exports: [ContentsService],
})
export class ContentsModule {}
