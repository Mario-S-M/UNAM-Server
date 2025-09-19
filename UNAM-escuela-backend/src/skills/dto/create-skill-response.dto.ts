import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateSkillResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}