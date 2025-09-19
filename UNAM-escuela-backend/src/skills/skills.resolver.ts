import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { CreateSkillResponse } from './dto/create-skill-response.dto';
import { UpdateSkillResponse } from './dto/update-skill-response.dto';
import { SkillsFilterArgs } from './dto/args/skills-filter.arg';
import { PaginatedSkills } from './dto/paginated-skills.output';
import { DeleteSkillResponse } from './dto/delete-skill-response.dto';
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

  // Public endpoint for skills by level - no authentication required
  @Query(() => [Skill], { name: 'skillsByLevelPublic' })
  findByLevelPublic(
    @Args('levelId', { type: () => ID }) levelId: string,
  ): Promise<Skill[]> {
    return this.skillsService.findByLevel(levelId);
  }

  // Public endpoint for single skill - no authentication required
  @Query(() => Skill, { name: 'skillPublic' })
  findOnePublic(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Skill> {
    return this.skillsService.findOne(id);
  }

  // Protected endpoints below
  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateSkillResponse)
  async createSkill(
    @Args('createSkillInput') createSkillInput: CreateSkillInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<CreateSkillResponse> {
    await this.skillsService.create(createSkillInput);
    return {
      success: true,
      message: 'Habilidad creada exitosamente'
    };
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
  @Query(() => [Skill], { name: 'skillsByLevel' })
  findByLevel(
    @Args('levelId', { type: () => ID }) levelId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Skill[]> {
    return this.skillsService.findByLevel(levelId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Skill], { name: 'skillsByLanguage' })
  findByLanguage(
    @Args('lenguageId', { type: () => ID }) lenguageId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Skill[]> {
    return this.skillsService.findByLanguage(lenguageId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Skill], { name: 'skillsByLevelAndLanguage' })
  findByLevelAndLanguage(
    @Args('levelId', { type: () => ID }) levelId: string,
    @Args('languageId', { type: () => ID }) languageId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Skill[]> {
    return this.skillsService.findByLevelAndLanguage(levelId, languageId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UpdateSkillResponse)
  async updateSkill(
    @Args('updateSkillInput') updateSkillInput: UpdateSkillInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<UpdateSkillResponse> {
    await this.skillsService.update(updateSkillInput.id, updateSkillInput);
    return {
      success: true,
      message: 'Habilidad actualizada exitosamente'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DeleteSkillResponse)
  async removeSkill(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<DeleteSkillResponse> {
    await this.skillsService.remove(id);
    return {
      success: true,
      message: 'Skill eliminado exitosamente'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Skill)
  toggleSkillActive(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Skill> {
    return this.skillsService.toggleActive(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedSkills, { name: 'skillsPaginated' })
  findPaginated(
    @Args() filters: SkillsFilterArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<PaginatedSkills> {
    return this.skillsService.findPaginated(filters);
  }
}
