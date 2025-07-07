import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

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
      'beginner',
      'mid-intermediate',
      'intermediate',
      'upper-intermediate',
      'advanced',
    ],
    {
      message:
        'La dificultad debe ser: beginner, mid-intermediate, intermediate, upper-intermediate o advanced',
    },
  )
  @Field(() => String, { nullable: true, defaultValue: 'beginner' })
  difficulty?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  lenguageId: string;
}
