import { Module } from '@nestjs/common';
import { LenguagesService } from './lenguages.service';
import { LenguagesResolver } from './lenguages.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lenguage } from './entities/lenguage.entity';
import { Level } from '../levels/entities/level.entity';

@Module({
  providers: [LenguagesResolver, LenguagesService],
  imports: [
    TypeOrmModule.forFeature([Lenguage, Level]),
  ],
})
export class LenguagesModule {}
