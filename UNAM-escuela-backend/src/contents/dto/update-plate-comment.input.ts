import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean } from 'class-validator';

@InputType()
export class UpdatePlateCommentInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  commentRich?: string; // JSON string of PlateJS rich content

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

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isEdited?: boolean;
}