import { InputType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserRolesInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles])
  @IsArray()
  roles: ValidRoles[];
}
