import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UpdateSkillResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}