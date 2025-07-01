import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';

@InputType()
export class AssignLanguageInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  languageId?: string;
}
