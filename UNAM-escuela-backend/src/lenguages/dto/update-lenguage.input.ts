import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateLenguageInput } from './create-lenguage.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateLenguageInput extends PartialType(CreateLenguageInput) {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  id: string;

  @IsString()
  @Field(() => String, { nullable: true })
  name: string;
}
