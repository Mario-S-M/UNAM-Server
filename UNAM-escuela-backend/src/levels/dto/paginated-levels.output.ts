import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Level } from '../entities/level.entity';

@ObjectType()
export class PaginatedLevels {
  @Field(() => [Level])
  levels: Level[];

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