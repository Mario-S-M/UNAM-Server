import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ContentsService } from './contents.service';
import { Content } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';

@Resolver(() => Content)
@UseGuards(JwtAuthGuard)
export class ContentsResolver {
  constructor(private readonly contentsService: ContentsService) {}

  @Mutation(() => Content)
  createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.create(createContentInput);
  }

  @Query(() => [Content], { name: 'contents' })
  findAll(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findAll();
  }

  @Query(() => [Content], { name: 'contentsByLevel' })
  findByLevel(
    @Args('levelId', { type: () => ID }) levelId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findByLevel(levelId);
  }

  @Query(() => [Content], { name: 'contentsByTeacher' })
  findByTeacher(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findByTeacher(teacherId);
  }

  @Query(() => [Content], { name: 'myAssignedContents' })
  findMyAssignedContents(
    @CurrentUser([ValidRoles.docente]) user: User,
  ): Promise<Content[]> {
    return this.contentsService.findByTeacher(user.id);
  }

  @Query(() => Content, { name: 'content' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ) {
    return this.contentsService.findOne(id);
  }

  @Mutation(() => Content)
  updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ) {
    return this.contentsService.update(
      updateContentInput.id,
      updateContentInput,
    );
  }

  @Mutation(() => Content)
  assignTeachersToContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('teacherIds', { type: () => [ID] }) teacherIds: string[],
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.assignTeachers(contentId, teacherIds);
  }

  @Mutation(() => Content)
  removeTeacherFromContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.removeTeacher(contentId, teacherId);
  }

  @Mutation(() => Content)
  removeContent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.remove(id);
  }

  @Query(() => String, { name: 'contentMarkdown' })
  getContentMarkdown(
    @Args('contentId', { type: () => ID }) contentId: string,
    @CurrentUser([ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<string> {
    return this.contentsService.getMarkdownContent(contentId, user.id);
  }

  @Mutation(() => Boolean, { name: 'updateContentMarkdown' })
  updateContentMarkdown(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('markdownContent', { type: () => String }) markdownContent: string,
    @CurrentUser([ValidRoles.docente]) user: User,
  ): Promise<boolean> {
    return this.contentsService.updateMarkdownContent(
      contentId,
      markdownContent,
      user.id,
    );
  }
}
