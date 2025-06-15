import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { LenguagesService } from './lenguages.service';
import { Lenguage } from './entities/lenguage.entity';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';

@Resolver(() => Lenguage)
export class LenguagesResolver {
  private readonly logger = new Logger(LenguagesResolver.name);

  constructor(private readonly lenguagesService: LenguagesService) {}

  @Mutation(() => Lenguage)
  createLenguage(
    @Args('createLenguageInput') createLenguageInput: CreateLenguageInput,
  ) {
    return this.lenguagesService.create(createLenguageInput);
  }

  @Query(() => [Lenguage], { name: 'lenguages' })
  findAll(): Promise<Lenguage[]> {
    return this.lenguagesService.findAll();
  }

  @Query(() => [Lenguage], { name: 'lenguagesActivate' })
  findActivate(): Promise<Lenguage[]> {
    this.logger.log('Fetching active languages');
    return this.lenguagesService.findActive();
  }

  @Query(() => Lenguage, { name: 'lenguage' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.lenguagesService.findOne(id);
  }

  @Mutation(() => Lenguage)
  updateLenguage(
    @Args('updateLenguageInput') updateLenguageInput: UpdateLenguageInput,
  ) {
    return this.lenguagesService.update(
      updateLenguageInput.id,
      updateLenguageInput,
    );
  }

  @Mutation(() => Lenguage)
  removeLenguage(@Args('id', { type: () => ID }) id: string) {
    return this.lenguagesService.remove(id);
  }
}
