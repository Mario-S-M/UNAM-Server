import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LevelsService } from './levels.service';
import { Level } from './entities/level.entity';
import { CreateLevelInput, UpdateLevelInput } from './dto/inputs';

@Resolver(() => Level)
export class LevelsResolver {
  constructor(private readonly levelsService: LevelsService) {}

  @Mutation(() => Level)
  async createLevel(@Args('createLevelInput') createLevelInput: CreateLevelInput) :Promise<Level> {
    return this.levelsService.create(createLevelInput);
  }

  @Query(() => [Level], { name: 'levels' })
  findAll(): Promise <Level[]> {
    return this.levelsService.findAll();
  }

  @Query(() => Level, { name: 'level' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.levelsService.findOne(id);
  }

  @Mutation(() => Level)
  updateLevel(@Args('updateLevelInput') updateLevelInput: UpdateLevelInput):Promise<Level> {
    return this.levelsService.update(updateLevelInput.id, updateLevelInput);
  }

  @Mutation(() => Level)
  removeLevel(@Args('id', { type: () => ID }) id: string):Promise<Level> {
    return this.levelsService.remove(id);
  }
}
