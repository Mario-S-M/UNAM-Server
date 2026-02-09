import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LenguagesService } from './lenguages.service';
import { LenguagesResolver } from './lenguages.resolver';
import { Lenguage } from './entities/lenguage.entity';
import { Level } from '../levels/entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lenguage, Level])],
  providers: [LenguagesResolver, LenguagesService],
  exports: [LenguagesService, TypeOrmModule],
})
export class LenguagesModule {}
