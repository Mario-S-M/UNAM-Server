import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, Min, Max, Validate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { QuestionTypeValidatorConstraint } from '../validators/question-type.validator';

// Enum para tipos de preguntas soportados
export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  OPEN_TEXT = 'open_text',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  RATING_SCALE = 'RATING_SCALE',
  NUMBER = 'NUMBER',
  EMAIL = 'EMAIL',
  DATE = 'DATE',
  TIME = 'TIME',
  BOOLEAN = 'BOOLEAN'
}

@InputType()
export class CreateFormQuestionOptionInput {
  @Field(() => String)
  @IsString()
  optionText: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  optionValue?: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  orderIndex: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  isCorrect: boolean = false;
}

@InputType()
export class CreateFormQuestionInput {
  @Field(() => String)
  @IsString()
  questionText: string;

  @Field(() => String)
  @IsEnum(QuestionType, { message: 'Tipo de pregunta no válido' })
  questionType: QuestionType;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  orderIndex: number;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  isRequired: boolean = true;

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

  @Field(() => Boolean)
  @IsBoolean()
  allowMultiline: boolean;

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

  @Field(() => [CreateFormQuestionOptionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormQuestionOptionInput)
  options?: CreateFormQuestionOptionInput[];

  @Validate(QuestionTypeValidatorConstraint)
  get _validation() {
    return this;
  }
}

@InputType()
export class CreateFormInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Boolean)
  @IsBoolean()
  allowAnonymous: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  allowMultipleResponses: boolean;

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

  @Field(() => ID)
  @IsUUID()
  contentId: string;

  @Field(() => [CreateFormQuestionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormQuestionInput)
  @Validate(QuestionTypeValidatorConstraint, { each: true })
  questions?: CreateFormQuestionInput[];
}