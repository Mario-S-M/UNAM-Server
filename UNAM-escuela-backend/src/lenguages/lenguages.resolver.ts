import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { LenguagesService } from './lenguages.service';
import { Lenguage } from './entities/lenguage.entity';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Lenguage)
export class LenguagesResolver {
  private readonly logger = new Logger(LenguagesResolver.name);

  constructor(private readonly lenguagesService: LenguagesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Lenguage)
  createLenguage(
    @Args('createLenguageInput') createLenguageInput: CreateLenguageInput,
    @CurrentUser([ValidRoles.superUser]) user: User,
  ) {
    this.logger.log(
      `SuperUser ${user.fullName} creating language: ${createLenguageInput.name}`,
    );
    return this.lenguagesService.create(createLenguageInput);
  }

  @Query(() => [Lenguage], { name: 'lenguages' })
  findAll(): Promise<Lenguage[]> {
    return this.lenguagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Lenguage], { name: 'lenguagesActivate' })
  findActivate(
    @CurrentUser([
      ValidRoles.superUser,
      ValidRoles.admin,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Lenguage[]> {
    this.logger.log(
      `User ${user.fullName} (${user.roles.join(', ')}) fetching active languages`,
    );
    return this.lenguagesService.findActive(user);
  }

  @Query(() => Lenguage, { name: 'lenguage' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.lenguagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Lenguage)
  updateLenguage(
    @Args('updateLenguageInput') updateLenguageInput: UpdateLenguageInput,
    @CurrentUser([ValidRoles.superUser]) user: User,
  ) {
    this.logger.log(
      `SuperUser ${user.fullName} updating language: ${updateLenguageInput.id}`,
    );
    return this.lenguagesService.update(
      updateLenguageInput.id,
      updateLenguageInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Lenguage)
  removeLenguage(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.superUser]) user: User,
  ) {
    this.logger.log(`SuperUser ${user.fullName} removing language: ${id}`);
    return this.lenguagesService.remove(id);
  }
}
