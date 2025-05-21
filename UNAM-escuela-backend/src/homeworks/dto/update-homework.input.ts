import { CreateHomeworkInput } from './create-homework.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHomeworkInput extends PartialType(CreateHomeworkInput) {
  @Field(() => Int)
  id: number;
}
