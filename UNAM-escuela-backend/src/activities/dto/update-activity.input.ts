import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { CreateActivityInput } from './create-activity.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { CreateFormQuestionInput } from '../../forms/dto/create-form.dto';

@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) {

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  id: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {nullable: true})
  name: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {nullable: true})
  description: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {nullable: true})
  indication: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {nullable: true})
  example: string;

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

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  validationStatus?: string;
}
