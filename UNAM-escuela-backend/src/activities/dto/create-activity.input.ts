import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFormQuestionInput } from '../../forms/dto/create-form.dto';

@InputType()
export class CreateActivityInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  indication: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  example: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  contentId: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  formId?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  estimatedTime?: number; // Tiempo estimado en minutos para completar la actividad

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormQuestionInput)
  @Field(() => [CreateFormQuestionInput], { nullable: true })
  questions?: CreateFormQuestionInput[];
}
