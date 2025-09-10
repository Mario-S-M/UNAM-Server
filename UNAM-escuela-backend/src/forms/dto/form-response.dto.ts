import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateFormAnswerInput {
  @Field(() => ID)
  @IsUUID()
  questionId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  textAnswer?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedOptionIds?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  numericAnswer?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  booleanAnswer?: boolean;
}

@InputType()
export class CreateFormResponseInput {
  @Field(() => ID)
  @IsUUID()
  formId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  respondentName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  respondentEmail?: string;

  @Field(() => Boolean)
  @IsBoolean()
  isAnonymous: boolean;

  @Field(() => [CreateFormAnswerInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormAnswerInput)
  answers: CreateFormAnswerInput[];
}

@InputType()
export class FormFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  contentId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}