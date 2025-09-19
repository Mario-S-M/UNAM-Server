import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateLevelResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}