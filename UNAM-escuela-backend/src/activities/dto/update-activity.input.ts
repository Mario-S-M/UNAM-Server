import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateActivityInput } from './create-activity.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

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
}
