import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LenguagesService } from './lenguages.service';
import { Lenguage } from './entities/lenguage.entity';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';

@Resolver(() => Lenguage)
export class LenguagesResolver {
  constructor(private readonly lenguagesService: LenguagesService) {}

  @Mutation(() => Lenguage)
  createLenguage(@Args('createLenguageInput') createLenguageInput: CreateLenguageInput) {
    return this.lenguagesService.create(createLenguageInput);
  }

  @Query(() => [Lenguage], { name: 'lenguages' })
  findAll() {
    return this.lenguagesService.findAll();
  }

  @Query(() => Lenguage, { name: 'lenguage' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.lenguagesService.findOne(id);
  }

  @Mutation(() => Lenguage)
  updateLenguage(@Args('updateLenguageInput') updateLenguageInput: UpdateLenguageInput) {
    return this.lenguagesService.update(updateLenguageInput.id, updateLenguageInput);
  }

  @Mutation(() => Lenguage)
  removeLenguage(@Args('id', { type: () => Int }) id: number) {
    return this.lenguagesService.remove(id);
  }
}
