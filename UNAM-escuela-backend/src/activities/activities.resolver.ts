import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Mutation(() => Activity)
  async createActivity(@Args('createActivityInput') createActivityInput: CreateActivityInput) :Promise<Activity> {
    return this.activitiesService.create(createActivityInput);
  }

  @Query(() => [Activity], { name: 'activities' })
  async findAll():Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Activity], { name: 'myAssignedActivities' })
  async findMyAssignedActivities(
    @CurrentUser([ValidRoles.docente]) user: User,
  ): Promise<Activity[]> {
    return this.activitiesService.findByAssignedTeacher(user.id);
  }
  @Query(() => [Activity], { name: 'activitiesByContent' })
  async findByContent(@Args('contentId', { type: () => ID }) contentId: string):Promise<Activity[]> {
    return this.activitiesService.findByContent(contentId);
  }

  @Query(() => [Activity], { name: 'exercisesByContent' })
  async findExercisesByContent(@Args('contentId', { type: () => ID }) contentId: string):Promise<Activity[]> {
    return this.activitiesService.findExercisesByContent(contentId);
  }

  @Query(() => Activity, { name: 'activity' })
  async findOne(@Args('id', { type: () => ID }) id: string):Promise<Activity> {
    return this.activitiesService.findOne(id);
  }

  @Mutation(() => Activity)
  async updateActivity(@Args('updateActivityInput') updateActivityInput: UpdateActivityInput):Promise<Activity> {
    return this.activitiesService.update(updateActivityInput.id, updateActivityInput);
  }

  @Mutation(() => Activity)
  async removeActivity(@Args('id', { type: () => ID }) id: string):Promise<Activity> {
    return this.activitiesService.remove(id);
  }
}
