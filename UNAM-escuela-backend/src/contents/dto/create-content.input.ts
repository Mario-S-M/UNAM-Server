import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateContentInput {
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
  @Field(() => ID)
  levelId: string;

  @IsOptional()
  @IsArray()
  @Field(() => [ID], { nullable: true })
  teacherIds?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  validationStatus?: string;

  @IsOptional()
  @IsString()
  @Field(() => ID, { nullable: true })
  skillId?: string;
}
