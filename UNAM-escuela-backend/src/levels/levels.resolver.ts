import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { Level } from './entities/level.entity';
import { CreateLevelInput, UpdateLevelInput } from './dto/inputs';
import { CreateLevelResponse } from './dto/create-level-response.dto';
import { UpdateLevelResponse } from './dto/update-level-response.dto';
import { DeleteLevelResponse } from './dto/delete-level-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { LevelsFilterArgs } from './dto/args/levels-filter.arg';
import { PaginatedLevels } from './dto/paginated-levels.output';

@Resolver(() => Level)
export class LevelsResolver {
  private readonly logger = new Logger(LevelsResolver.name);

  constructor(private readonly levelsService: LevelsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateLevelResponse)
  async createLevel(
    @Args('createLevelInput') createLevelInput: CreateLevelInput,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User,
  ): Promise<CreateLevelResponse> {
    this.logger.log(
      `User ${user.fullName} (${user.roles.join(', ')}) creating level for language: ${createLevelInput.lenguageId}`,
    );
    await this.levelsService.create(createLevelInput, user);
    return {
      success: true,
      message: 'Nivel creado exitosamente'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Level], { name: 'levels' })
  async findAll(
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin, ValidRoles.docente])
    user: User,
  ): Promise<Level[]> {
    return this.levelsService.findAll(user);
  }

  @Query(() => PaginatedLevels, { name: 'levelsPaginated' })
  async findPaginated(@Args() filters: LevelsFilterArgs): Promise<PaginatedLevels> {
    return this.levelsService.findPaginated(filters);
  }

  @Query(() => Level, { name: 'level' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.levelsService.findOne(id);
  }

  @Query(() => [Level], { name: 'levelsByLenguage' })
  async findByLenguage(
    @Args('lenguageId', { type: () => ID }) lenguageId: string,
    @CurrentUser([
      [
        ValidRoles.superUser,
        ValidRoles.admin,
        ValidRoles.docente,
        ValidRoles.alumno,
      ],
      { optional: true },
    ])
    user?: User,
  ): Promise<Level[]> {
    this.logger.log(
      `${user ? `User ${user.fullName}` : 'Guest user'} requesting levels for language: ${lenguageId}`,
    );
    return this.levelsService.findByLenguage(lenguageId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UpdateLevelResponse)
  async updateLevel(
    @Args('updateLevelInput') updateLevelInput: UpdateLevelInput,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User,
  ): Promise<UpdateLevelResponse> {
    this.logger.log(
      `User ${user.fullName} updating level: ${updateLevelInput.id}`,
    );
    await this.levelsService.update(
      updateLevelInput.id,
      updateLevelInput,
      user,
    );
    return {
      success: true,
      message: 'Nivel actualizado exitosamente'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DeleteLevelResponse)
  async removeLevel(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User,
  ): Promise<DeleteLevelResponse> {
    this.logger.log(`User ${user.fullName} removing level: ${id}`);
    await this.levelsService.remove(id, user);
    return {
      success: true,
      message: 'Nivel eliminado exitosamente'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Level)
  toggleLevelStatus(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User,
  ) {
    this.logger.log(`User ${user.fullName} toggling level status: ${id}`);
    return this.levelsService.toggleLevelStatus(id);
  }
}
