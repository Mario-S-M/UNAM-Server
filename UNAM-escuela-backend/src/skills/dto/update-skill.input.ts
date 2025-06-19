import { CreateSkillInput } from './create-skill.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  id: string;
}
