import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateContentCommentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  comment: string;

  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  contentId: string;
}