import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateContentInput } from './create-content.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateContentInput extends PartialType(CreateContentInput) {
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
}
