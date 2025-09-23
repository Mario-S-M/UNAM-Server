import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ContentsService } from './contents.service';
import { Content } from './entities/content.entity';
import { ContentComment } from './entities/content-comment.entity';
import { PlateComment } from './entities/plate-comment.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { CreateContentCommentInput } from './dto/create-content-comment.input';
import { UpdateContentCommentInput } from './dto/update-content-comment.input';
import { CreatePlateCommentInput } from './dto/create-plate-comment.input';
import { UpdatePlateCommentInput } from './dto/update-plate-comment.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { PaginatedContents } from './dto/paginated-contents.output';
import { ContentsFilterArgs } from './dto/args/contents-filter.arg';
import { RemoveContentResponse } from './dto/remove-content-response.output';

@Resolver(() => Content)
export class ContentsResolver {
  constructor(private readonly contentsService: ContentsService) {}

  // Public endpoints for validated content - no authentication required
  @Query(() => [Content], { name: 'contentsByLevelPublic' })
  findByLevelPublic(
    @Args('levelId', { type: () => ID }) levelId: string,
  ): Promise<Content[]> {
    return this.contentsService.findValidatedByLevel(levelId);
  }

  @Query(() => [Content], { name: 'contentsBySkillPublic' })
  findBySkillPublic(
    @Args('skillId', { type: () => ID }) skillId: string,
  ): Promise<Content[]> {
    return this.contentsService.findValidatedBySkill(skillId);
  }

  @Query(() => [Content], { name: 'contentsByLevelAndSkillPublic' })
  findByLevelAndSkillPublic(
    @Args('levelId', { type: () => ID }) levelId: string,
    @Args('skillId', { type: () => ID }) skillId: string,
  ): Promise<Content[]> {
    return this.contentsService.findValidatedByLevelAndSkill(levelId, skillId);
  }

  // Public endpoint for single validated content - no authentication required
  @Query(() => Content, { name: 'contentPublic' })
  findOnePublic(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Content> {
    return this.contentsService.findOnePublic(id);
  }

  // Public endpoint for validated content markdown - no authentication required
  @Query(() => String, { name: 'contentMarkdownPublic' })
  getContentMarkdownPublic(
    @Args('contentId', { type: () => ID }) contentId: string,
  ): Promise<string> {
    return this.contentsService.getMarkdownContentPublic(contentId);
  }

  // Public endpoint for all contents with optional filters - no authentication required
  @Query(() => [Content], { name: 'allContentsPublic' })
  findAllPublic(
    @Args('languageId', { type: () => ID, nullable: true }) languageId?: string,
    @Args('levelId', { type: () => ID, nullable: true }) levelId?: string,
    @Args('skillId', { type: () => ID, nullable: true }) skillId?: string,
  ): Promise<Content[]> {
    return this.contentsService.findAllPublic(languageId, levelId, skillId);
  }



  // Protected endpoints below
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Content)
  createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.create(createContentInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'contents' })
  findAll(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedContents, { name: 'contentsPaginated' })
  findPaginated(
    @Args() filters: ContentsFilterArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<PaginatedContents> {
    return this.contentsService.findPaginated(filters, user);
  }

  @UseGuards(JwtAuthGuard)
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
    return this.contentsService.findByLevel(levelId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'contentsByTeacher' })
  findByTeacher(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findByTeacher(teacherId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'contentsBySkill' })
  findBySkill(
    @Args('skillId', { type: () => ID }) skillId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findBySkill(skillId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'contentsByLevelAndSkill' })
  findByLevelAndSkill(
    @Args('levelId', { type: () => ID }) levelId: string,
    @Args('skillId', { type: () => ID }) skillId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findByLevelAndSkill(levelId, skillId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'myAssignedContents' })
  findMyAssignedContents(
    @CurrentUser([ValidRoles.docente]) user: User,
  ): Promise<Content[]> {
    console.log(
      '🔍 findMyAssignedContents called for user:',
      user.id,
      user.email,
    );
    return this.contentsService.findByTeacher(user.id);
  }

  @UseGuards(JwtAuthGuard)
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
    console.log('🔍 ContentsResolver.findOne - Called with:', {
      id,
      user: user ? { id: user.id, roles: user.roles } : null,
    });
    return this.contentsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Content)
  assignTeachersToContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('teacherIds', { type: () => [ID] }) teacherIds: string[],
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.assignTeachers(contentId, teacherIds, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Content)
  removeTeacherFromContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.removeTeacher(contentId, teacherId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => RemoveContentResponse)
  async removeContent(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<RemoveContentResponse> {
    try {
      await this.contentsService.remove(id);
      return {
        success: true,
        message: 'Contenido eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar el contenido'
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => String, { name: 'contentMarkdown' })
  getContentMarkdown(
    @Args('contentId', { type: () => ID }) contentId: string,
    @CurrentUser([ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<string> {
    return this.contentsService.getMarkdownContent(contentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'updateContentMarkdown' })
  updateContentMarkdown(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('markdownContent', { type: () => String }) markdownContent: string,
    @CurrentUser([ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<boolean> {
    return this.contentsService.updateMarkdownContent(
      contentId,
      markdownContent,
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Content, { name: 'validateContent' })
  validateContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.validateContent(contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Content, { name: 'invalidateContent' })
  invalidateContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<Content> {
    return this.contentsService.invalidateContent(contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'validatedContentsByLevel' })
  findValidatedByLevel(
    @Args('levelId', { type: () => ID }) levelId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findValidatedByLevel(levelId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'validatedContentsBySkill' })
  findValidatedBySkill(
    @Args('skillId', { type: () => ID }) skillId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findValidatedBySkill(skillId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Content], { name: 'validatedContentsByLevelAndSkill' })
  findValidatedByLevelAndSkill(
    @Args('levelId', { type: () => ID }) levelId: string,
    @Args('skillId', { type: () => ID }) skillId: string,
    @CurrentUser([
      ValidRoles.admin,
      ValidRoles.superUser,
      ValidRoles.docente,
      ValidRoles.alumno,
    ])
    user: User,
  ): Promise<Content[]> {
    return this.contentsService.findValidatedByLevelAndSkill(levelId, skillId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, { name: 'validateAllContent' })
  async validateAllContent(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<string> {
    const result = await this.contentsService.validateAllContent();
    return `${result.message} - Updated ${result.updatedCount} items`;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'convertDocxToMarkdown' })
  async convertDocxToMarkdown(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('docxBase64', { type: () => String }) docxBase64: string,
    @CurrentUser([ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<boolean> {
    console.log('🚀 GraphQL convertDocxToMarkdown mutation called');
    console.log('📋 Content ID:', contentId);
    console.log('👤 User:', user?.id, '-', user?.email);
    console.log('📄 Base64 length:', docxBase64?.length);

    try {
      // Decode base64 to buffer
      console.log('🔧 Decoding base64 to buffer...');
      const docxBuffer = Buffer.from(docxBase64, 'base64');
      console.log('✅ Buffer created, size:', docxBuffer.length, 'bytes');

      // Call service method
      console.log('📞 Calling ContentsService.convertDocxToMarkdown...');
      const result = await this.contentsService.convertDocxToMarkdown(
        contentId,
        docxBuffer,
        user.id,
      );

      console.log('🎯 Service method completed, result:', result);
      return result;
    } catch (error) {
      console.error('💥 Error in convertDocxToMarkdown resolver:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  // Mutations y Queries para comentarios
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ContentComment, { name: 'createContentComment' })
  createContentComment(
    @Args('createContentCommentInput') createContentCommentInput: CreateContentCommentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<ContentComment> {
    return this.contentsService.createComment(createContentCommentInput, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ContentComment], { name: 'contentComments' })
  getContentComments(
    @Args('contentId', { type: () => ID }) contentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<ContentComment[]> {
    return this.contentsService.getCommentsByContent(contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ContentComment, { name: 'updateContentComment' })
  updateContentComment(
    @Args('updateContentCommentInput') updateContentCommentInput: UpdateContentCommentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<ContentComment> {
    return this.contentsService.updateComment(updateContentCommentInput, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'deleteContentComment' })
  deleteContentComment(
    @Args('commentId', { type: () => ID }) commentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<boolean> {
    return this.contentsService.deleteComment(commentId, user.id);
  }

  // PlateJS Comments Mutations and Queries
  @UseGuards(JwtAuthGuard)
  @Mutation(() => PlateComment, { name: 'createPlateComment' })
  createPlateComment(
    @Args('createPlateCommentInput') createPlateCommentInput: CreatePlateCommentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<PlateComment> {
    return this.contentsService.createPlateComment(createPlateCommentInput, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [PlateComment], { name: 'plateComments' })
  getPlateComments(
    @Args('contentId', { type: () => ID }) contentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<PlateComment[]> {
    return this.contentsService.getPlateCommentsByContent(contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PlateComment, { name: 'updatePlateComment' })
  updatePlateComment(
    @Args('updatePlateCommentInput') updatePlateCommentInput: UpdatePlateCommentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<PlateComment> {
    return this.contentsService.updatePlateComment(updatePlateCommentInput, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'deletePlateComment' })
  deletePlateComment(
    @Args('commentId', { type: () => ID }) commentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<boolean> {
    return this.contentsService.deletePlateComment(commentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PlateComment, { name: 'resolvePlateComment' })
  resolvePlateComment(
    @Args('commentId', { type: () => ID }) commentId: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente]) user: User,
  ): Promise<PlateComment> {
    return this.contentsService.resolvePlateComment(commentId, user.id);
  }
}
