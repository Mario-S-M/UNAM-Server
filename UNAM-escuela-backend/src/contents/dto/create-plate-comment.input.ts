import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreatePlateCommentInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  comment: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  commentRich?: string; // JSON string of PlateJS rich content

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  contentId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  textSelection?: string; // JSON string with text selection info

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  selectedText?: string; // The actual selected text for reference

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  position?: string; // JSON string with position information
}