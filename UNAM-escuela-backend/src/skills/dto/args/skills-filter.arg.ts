import { ArgsType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsUUID,
} from 'class-validator';

@ArgsType()
export class SkillsFilterArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del nivel debe ser un UUID válido' })
  levelId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del idioma debe ser un UUID válido' })
  lenguageId?: string;
}
