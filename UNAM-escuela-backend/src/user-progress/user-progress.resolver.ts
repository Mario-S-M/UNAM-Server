import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { UserProgress } from './entities/user-progress.entity';
import { UserActivityHistory } from './entities/user-activity-history.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
class OverallProgress {
  @Field(() => Int)
  totalContents: number;

  @Field(() => Int)
  completedContents: number;

  @Field(() => Float)
  overallPercentage: number;

  @Field(() => Int)
  totalActivities: number;

  @Field(() => Int)
  completedActivities: number;
}

@Resolver(() => UserProgress)
export class UserProgressResolver {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Query(() => [UserProgress])
  @UseGuards(JwtAuthGuard)
  async myProgress(
    @Context() context: any,
    @Args('contentId', { type: () => String, nullable: true }) contentId?: string,
  ): Promise<UserProgress[]> {
    const userId = context.req.user.id;
    return this.userProgressService.getUserProgress(userId, contentId);
  }

  @Query(() => [UserActivityHistory])
  @UseGuards(JwtAuthGuard)
  async myActivityHistory(
    @Context() context: any,
    @Args('contentId', { type: () => String, nullable: true }) contentId?: string,
    @Args('activityId', { type: () => String, nullable: true }) activityId?: string,
  ): Promise<UserActivityHistory[]> {
    const userId = context.req.user.id;
    return this.userProgressService.getUserActivityHistory(userId, contentId, activityId);
  }

  @Query(() => OverallProgress)
  @UseGuards(JwtAuthGuard)
  async myOverallProgress(@Context() context: any): Promise<OverallProgress> {
    const userId = context.req.user.id;
    return this.userProgressService.getOverallProgress(userId);
  }

  @Query(() => [UserProgress])
  @UseGuards(JwtAuthGuard)
  async userProgress(
    @Args('userId', { type: () => String }) userId: string,
    @Context() context: any,
    @Args('contentId', { type: () => String, nullable: true }) contentId?: string,
  ): Promise<UserProgress[]> {
    // Solo permitir a administradores y profesores ver el progreso de otros usuarios
    const currentUser = context.req.user;
    if (!['admin', 'profesor'].includes(currentUser.role)) {
      throw new Error('No tienes permisos para ver el progreso de otros usuarios');
    }
    return this.userProgressService.getUserProgress(userId, contentId);
  }

  @Query(() => [UserActivityHistory])
  @UseGuards(JwtAuthGuard)
  async userActivityHistory(
    @Args('userId', { type: () => String }) userId: string,
    @Context() context: any,
    @Args('contentId', { type: () => String, nullable: true }) contentId?: string,
    @Args('activityId', { type: () => String, nullable: true }) activityId?: string,
  ): Promise<UserActivityHistory[]> {
    // Solo permitir a administradores y profesores ver el historial de otros usuarios
    const currentUser = context.req.user;
    if (!['admin', 'profesor'].includes(currentUser.role)) {
      throw new Error('No tienes permisos para ver el historial de otros usuarios');
    }
    return this.userProgressService.getUserActivityHistory(userId, contentId, activityId);
  }

  @Query(() => OverallProgress)
  @UseGuards(JwtAuthGuard)
  async userOverallProgress(
    @Args('userId', { type: () => String }) userId: string,
    @Context() context: any,
  ): Promise<OverallProgress> {
    // Solo permitir a administradores y profesores ver el progreso general de otros usuarios
    const currentUser = context.req.user;
    if (!['admin', 'profesor'].includes(currentUser.role)) {
      throw new Error('No tienes permisos para ver el progreso de otros usuarios');
    }
    return this.userProgressService.getOverallProgress(userId);
  }
}