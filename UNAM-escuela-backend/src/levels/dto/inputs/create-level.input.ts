import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsIn, IsBoolean, IsNumber } from 'class-validator';

@InputType()
export class CreateLevelInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'Básico',
      'Básico-Intermedio',
      'Intermedio',
      'Intermedio-Avanzado',
      'Avanzado',
    ],
    {
      message:
        'La dificultad debe ser: Básico, Básico-Intermedio, Intermedio, Intermedio-Avanzado o Avanzado',
    },
  )
  @Field(() => String, { nullable: true, defaultValue: 'Básico' })
  difficulty?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  lenguageId: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive?: boolean;


}
