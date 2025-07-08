import { ArgsType, Field, Int, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@ArgsType()
export class UsersFilterArgs {
  @Field(() => [ValidRoles], { nullable: true })
  @IsOptional()
  roles?: ValidRoles[] = [];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  assignedLanguageId?: string;
}
