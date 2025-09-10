import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, Min, Max, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { HasCorrectAnswerConstraint } from './create-form.dto';

@InputType()
export class UpdateFormQuestionOptionInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  optionText?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  optionValue?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}

@InputType()
export class UpdateFormQuestionInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  questionText?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  questionType?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  minValue?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxValue?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  minLabel?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  maxLabel?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5000)
  maxLength?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  allowMultiline?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctOptionIds?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  explanation?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  incorrectFeedback?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  @Field(() => [UpdateFormQuestionOptionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFormQuestionOptionInput)
  options?: UpdateFormQuestionOptionInput[];

  @Validate(HasCorrectAnswerConstraint)
  get _validation() {
    return this;
  }
}

@InputType()
export class UpdateFormInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  allowMultipleResponses?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  successMessage?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  textColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @Field(() => [UpdateFormQuestionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFormQuestionInput)
  questions?: UpdateFormQuestionInput[];
}