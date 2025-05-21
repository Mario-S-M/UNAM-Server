import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateActivityInput {
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
  @Field(() => String)
  indication: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  example: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  contentId: string;
}
