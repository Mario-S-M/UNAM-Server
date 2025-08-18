import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Lenguage } from '../entities/lenguage.entity';

@ObjectType()
export class PaginatedLenguages {
  @Field(() => [Lenguage])
  lenguages: Lenguage[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}