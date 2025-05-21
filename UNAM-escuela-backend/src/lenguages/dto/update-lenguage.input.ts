import { CreateLenguageInput } from './create-lenguage.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLenguageInput extends PartialType(CreateLenguageInput) {
  @Field(() => Int)
  id: number;
}
