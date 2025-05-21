import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ActivitiesService {

  constructor(
      @InjectRepository(Activity)
          private readonly activitiesRepository: Repository<Activity>,
    ) {}

    async create(createActivityInput: CreateActivityInput): Promise<Activity> {
      const newActivity = this.activitiesRepository.create(createActivityInput);
      return await this.activitiesRepository.save(newActivity);
    }
  
  async findAll():Promise<Activity[]> {
    return await this.activitiesRepository.find();
  }

  async findByContent(contentId: string):Promise<Activity[]> {
    return await this.activitiesRepository.find({where: {contentId}});
  }

  async findOne(id: string):Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({where: {id}});
    if (!activity) throw new NotFoundException('Actividad no encontrada');
    return activity;
  }

  async update(id: string, updateActivityInput: UpdateActivityInput):Promise<Activity> {
    const activity = await this.findOne(id);
    if (updateActivityInput.name) activity.name = updateActivityInput.name;
    if (updateActivityInput.description) activity.description = updateActivityInput.description;
    if (updateActivityInput.indication) activity.indication = updateActivityInput.indication;
    if (updateActivityInput.example) activity.example = updateActivityInput.example;
    return await this.activitiesRepository.save(activity);
  }

  async remove(id: string):Promise<Activity> {
    const activity = await this.findOne(id);
    await this.activitiesRepository.remove(activity);
    return { ...activity, id };
  }
}
