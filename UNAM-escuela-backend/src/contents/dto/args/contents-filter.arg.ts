import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';

@ArgsType()
export class ContentsFilterArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  levelId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  skillId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  validationStatus?: string;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsPositive()
  page: number = 1;

  @Field(() => Int, { defaultValue: 5 })
  @IsOptional()
  @Min(1)
  @Max(50)
  limit: number = 5;
}
