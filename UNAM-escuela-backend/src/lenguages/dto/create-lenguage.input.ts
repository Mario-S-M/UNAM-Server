import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLenguageInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
