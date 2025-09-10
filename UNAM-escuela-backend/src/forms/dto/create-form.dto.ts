import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, Min, Max, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'hasCorrectAnswer', async: false })
export class HasCorrectAnswerConstraint implements ValidatorConstraintInterface {
  validate(question: any, args: ValidationArguments) {
    // Para preguntas de texto abierto, debe tener correctAnswer
    if (question.questionType === 'open_text') {
      return question.correctAnswer && question.correctAnswer.trim().length > 0;
    }
    
    // Para preguntas de opción múltiple, debe tener al menos una opción correcta
    if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
      return question.options && question.options.some((option: any) => option.isCorrect === true);
    }
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const question = args.object as any;
    if (question.questionType === 'open_text') {
      return 'Las preguntas de texto abierto deben tener una respuesta correcta';
    }
    if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
      return 'Las preguntas de opción múltiple deben tener al menos una respuesta correcta marcada';
    }
    return 'La pregunta debe tener una respuesta correcta válida';
  }
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
  @IsString()
  questionType: string; // 'multiple_choice', 'single_choice', 'open_text', 'checkbox', 'rating_scale', 'yes_no'

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

  @Validate(HasCorrectAnswerConstraint)
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
  questions?: CreateFormQuestionInput[];
}