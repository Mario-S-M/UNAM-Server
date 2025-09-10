import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, Min, Max, Validate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerTypeValidatorConstraint } from '../validators/question-type.validator';
import { QuestionType } from './create-form.dto';

@InputType()
export class CreateFormAnswerInput {
  @Field(() => ID)
  @IsUUID()
  questionId: string;

  @Field(() => String)
  @IsEnum(QuestionType, { message: 'Tipo de pregunta no válido' })
  questionType: QuestionType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  textAnswer?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  multipleChoiceAnswer?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  singleChoiceAnswer?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  numberAnswer?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  booleanAnswer?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  dateAnswer?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  timeAnswer?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  ratingAnswer?: number;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  isRequired: boolean = true;

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

  // Getter para obtener el valor de la respuesta según el tipo
  get answerValue(): any {
    switch (this.questionType) {
      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
      case QuestionType.OPEN_TEXT:
      case QuestionType.EMAIL:
        return this.textAnswer;
      
      case QuestionType.MULTIPLE_CHOICE:
        return this.multipleChoiceAnswer;
      
      case QuestionType.CHECKBOX:
      case QuestionType.BOOLEAN:
        return this.singleChoiceAnswer || (this.booleanAnswer !== undefined ? this.booleanAnswer.toString() : undefined);
      
      case QuestionType.NUMBER:
        return this.numberAnswer;
      
      case QuestionType.RATING_SCALE:
        return this.ratingAnswer;
      
      case QuestionType.DATE:
        return this.dateAnswer;
      
      case QuestionType.TIME:
        return this.timeAnswer;
      
      default:
        return undefined;
    }
  }

  @Validate(AnswerTypeValidatorConstraint)
  get _validation() {
    return this;
  }
}

@InputType()
export class CreateFormResponseInput {
  @Field(() => ID)
  @IsUUID()
  formId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  contentId?: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  isAnonymous: boolean = false;

  @Field(() => [CreateFormAnswerInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormAnswerInput)
  answers: CreateFormAnswerInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  submitterName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  submitterEmail?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class UpdateFormResponseInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [CreateFormAnswerInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormAnswerInput)
  answers?: CreateFormAnswerInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  submitterName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  submitterEmail?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}