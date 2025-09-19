import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteSkillResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}