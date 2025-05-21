import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateLevelInput {

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