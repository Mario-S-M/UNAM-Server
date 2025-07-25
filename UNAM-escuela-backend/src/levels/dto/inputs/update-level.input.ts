import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

@InputType()
export class UpdateLevelInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  id: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
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
  @Field(() => String, { nullable: true })
  difficulty?: string;
}
