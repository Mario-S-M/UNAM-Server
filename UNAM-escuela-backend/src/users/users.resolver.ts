import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UsersFilterArgs } from './dto/args/users-filter.arg';
import { PaginatedUsers } from './dto/paginated-users.output';
import { UpdateUserRolesInput } from './dto/update-user-roles.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AssignLanguageInput } from './dto/assign-language.input';
import { AssignMultipleLanguagesInput } from './dto/assign-multiple-languages.input';
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
    return this.usersService.findAll(validRoles.roles, user);
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
    return this.usersService.findPaginated(filters, user);
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

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin])
    adminUser: User,
  ): Promise<User> {
    return this.usersService.updateUser(updateUserInput, adminUser);
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

  @Mutation(() => User, { name: 'assignMultipleLanguagesToUser' })
  assignMultipleLanguagesToUser(
    @Args('assignMultipleLanguagesInput')
    assignMultipleLanguagesInput: AssignMultipleLanguagesInput,
    @CurrentUser([ValidRoles.superUser])
    user: User,
  ): Promise<User> {
    this.logger.log(
      `SuperUser ${user.fullName} assigning multiple languages to user: ${assignMultipleLanguagesInput.userId}`,
    );
    return this.usersService.assignMultipleLanguagesToUser(
      assignMultipleLanguagesInput.userId,
      assignMultipleLanguagesInput.languageIds,
      user,
    );
  }

  @Mutation(() => User, { name: 'assignAdminLanguageToTeacher' })
  assignAdminLanguageToTeacher(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @CurrentUser([ValidRoles.admin])
    adminUser: User,
  ): Promise<User> {
    this.logger.log(
      `Admin ${adminUser.fullName} assigning their language to teacher: ${teacherId}`,
    );
    return this.usersService.assignAdminLanguageToTeacher(teacherId, adminUser);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  deleteUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.superUser])
    superUser: User,
  ): Promise<User> {
    this.logger.log(
      `SuperUser ${superUser.fullName} attempting to delete user with ID: ${id}`,
    );
    return this.usersService.deleteUser(id, superUser);
  }
}
