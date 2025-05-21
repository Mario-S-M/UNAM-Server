import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';

@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Mutation(() => Activity)
  createActivity(@Args('createActivityInput') createActivityInput: CreateActivityInput) :Promise<Activity> {
    return this.activitiesService.create(createActivityInput);
  }

  @Query(() => [Activity], { name: 'activities' })
  findAll():Promise<Activity[]> {
    return this.activitiesService.findAll();
  }
  @Query(() => [Activity], { name: 'activitiesByContent' })
  findByContent(@Args('contentId', { type: () => ID }) contentId: string):Promise<Activity[]> {
    return this.activitiesService.findByContent(contentId);
  }

  @Query(() => Activity, { name: 'activity' })
  findOne(@Args('id', { type: () => ID }) id: string):Promise<Activity> {
    return this.activitiesService.findOne(id);
  }

  @Mutation(() => Activity)
  updateActivity(@Args('updateActivityInput') updateActivityInput: UpdateActivityInput):Promise<Activity> {
    return this.activitiesService.update(updateActivityInput.id, updateActivityInput);
  }

  @Mutation(() => Activity)
  removeActivity(@Args('id', { type: () => ID }) id: string):Promise<Activity> {
    return this.activitiesService.remove(id);
  }
}
