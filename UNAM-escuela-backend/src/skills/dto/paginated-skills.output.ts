import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Skill } from '../entities/skill.entity';

@ObjectType()
export class PaginatedSkills {
  @Field(() => [Skill])
  skills: Skill[];

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
