import { Module } from '@nestjs/common';
import { LenguagesService } from './lenguages.service';
import { LenguagesResolver } from './lenguages.resolver';

@Module({
  providers: [LenguagesResolver, LenguagesService],
})
export class LenguagesModule {}
