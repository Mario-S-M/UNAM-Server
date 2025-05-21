import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Lenguage {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
