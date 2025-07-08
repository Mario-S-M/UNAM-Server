import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsArray, IsOptional } from 'class-validator';

@InputType()
export class AssignMultipleLanguagesInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  languageIds?: string[];
}
