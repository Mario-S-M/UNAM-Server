import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Content } from '../entities/content.entity';

@ObjectType()
export class PaginatedContents {
  @Field(() => [Content])
  contents: Content[];

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
