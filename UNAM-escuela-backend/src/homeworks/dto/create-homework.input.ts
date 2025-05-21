import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHomeworkInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
