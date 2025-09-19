import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteLevelResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}