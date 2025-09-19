import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UpdateLevelResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}