import { ArgsType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

@ArgsType()
export class LevelsFilterArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 5;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  lenguageId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  difficulty?: string;
}