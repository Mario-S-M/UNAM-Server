import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';

@Resolver(() => Skill)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  // Public endpoint for active skills - no authentication required
  @Query(() => [Skill], { name: 'skillsActivePublic' })
  findActivePublic(): Promise<Skill[]> {
    return this.skillsService.findActive();
  }

  // Protected endpoints below
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Skill)
  createSkill(
    @Args('createSkillInput') createSkillInput: CreateSkillInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Skill> {
    return this.skillsService.create(createSkillInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Skill], { name: 'skills' })
  findAll(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<Skill[]> {
    return this.skillsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Skill], { name: 'skillsActive' })
  findActive(
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Skill[]> {
    return this.skillsService.findActive();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Skill, { name: 'skill' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<Skill> {
    return this.skillsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Skill)
  updateSkill(
    @Args('updateSkillInput') updateSkillInput: UpdateSkillInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Skill> {
    return this.skillsService.update(updateSkillInput.id, updateSkillInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Skill)
  removeSkill(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Skill> {
    return this.skillsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Skill)
  toggleSkillActive(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Skill> {
    return this.skillsService.toggleActive(id);
  }
}
