import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UsersFilterArgs } from './dto/args/users-filter.arg';
import { PaginatedUsers } from './dto/paginated-users.output';
import { UpdateUserRolesInput } from './dto/update-user-roles.input';
import { AssignLanguageInput } from './dto/assign-language.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  private readonly logger = new Logger(UsersResolver.name);

  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin, ValidRoles.docente])
    user: User,
  ): Promise<User[]> {
    this.logger.log(
      `Finding users with roles: ${JSON.stringify(validRoles.roles)}`,
    );
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => PaginatedUsers, { name: 'usersPaginated' })
  findPaginated(
    @Args() filters: UsersFilterArgs,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin, ValidRoles.docente])
    user: User,
  ): Promise<PaginatedUsers> {
    this.logger.log(
      `Finding paginated users with filters: ${JSON.stringify(filters)}`,
    );
    return this.usersService.findPaginated(filters);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin, ValidRoles.docente])
    user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin, ValidRoles.docente])
    user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, { name: 'updateUserRoles' })
  updateUserRoles(
    @Args('updateUserRolesInput') updateUserRolesInput: UpdateUserRolesInput,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin, ValidRoles.docente])
    user: User,
  ): Promise<User> {
    return this.usersService.updateUserRoles(
      updateUserRolesInput.id,
      updateUserRolesInput.roles,
      user,
    );
  }

  @Mutation(() => User, { name: 'assignLanguageToUser' })
  assignLanguageToUser(
    @Args('assignLanguageInput') assignLanguageInput: AssignLanguageInput,
    @CurrentUser([ValidRoles.superUser])
    user: User,
  ): Promise<User> {
    this.logger.log(
      `SuperUser ${user.fullName} assigning language to user: ${assignLanguageInput.userId}`,
    );
    return this.usersService.assignLanguageToUser(
      assignLanguageInput.userId,
      assignLanguageInput.languageId,
      user,
    );
  }
}
