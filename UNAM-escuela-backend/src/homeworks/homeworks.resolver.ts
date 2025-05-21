import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HomeworksService } from './homeworks.service';
import { Homework } from './entities/homework.entity';
import { CreateHomeworkInput } from './dto/create-homework.input';
import { UpdateHomeworkInput } from './dto/update-homework.input';

@Resolver(() => Homework)
export class HomeworksResolver {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Mutation(() => Homework)
  createHomework(@Args('createHomeworkInput') createHomeworkInput: CreateHomeworkInput) {
    return this.homeworksService.create(createHomeworkInput);
  }

  @Query(() => [Homework], { name: 'homeworks' })
  findAll() {
    return this.homeworksService.findAll();
  }

  @Query(() => Homework, { name: 'homework' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.homeworksService.findOne(id);
  }

  @Mutation(() => Homework)
  updateHomework(@Args('updateHomeworkInput') updateHomeworkInput: UpdateHomeworkInput) {
    return this.homeworksService.update(updateHomeworkInput.id, updateHomeworkInput);
  }

  @Mutation(() => Homework)
  removeHomework(@Args('id', { type: () => Int }) id: number) {
    return this.homeworksService.remove(id);
  }
}
