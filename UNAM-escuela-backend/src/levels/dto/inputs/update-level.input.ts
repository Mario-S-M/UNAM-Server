import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsIn, IsBoolean, IsNumber } from 'class-validator';

@InputType()
export class UpdateLevelInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  id: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

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
  @Field(() => String, { nullable: true })
  difficulty?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  lenguageId?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;


}
