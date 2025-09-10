import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Form, FormResponse } from './entities';
import { CreateFormInput, UpdateFormInput, CreateFormResponseInput, FormFiltersInput } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserProgressService } from '../user-progress/user-progress.service';

@Resolver(() => Form)
export class FormsResolver {
  constructor(
    private readonly formsService: FormsService,
    private readonly userProgressService: UserProgressService,
  ) {}

  @Mutation(() => Form)
  @UseGuards(JwtAuthGuard)
  async createForm(
    @Args('createFormInput') createFormInput: CreateFormInput,
    @CurrentUser() user: User,
  ): Promise<Form> {
    return this.formsService.createForm(createFormInput, user.id);
  }

  @Mutation(() => Form)
  @UseGuards(JwtAuthGuard)
  async updateForm(
    @Args('updateFormInput') updateFormInput: UpdateFormInput,
    @CurrentUser() user: User,
  ): Promise<Form> {
    return this.formsService.updateForm(updateFormInput, user.id);
  }

  @Query(() => Form)
  async getForm(@Args('id', { type: () => ID }) id: string): Promise<Form> {
    return this.formsService.findFormById(id);
  }

  @Query(() => [Form])
  async getFormsByContent(
    @Args('contentId', { type: () => ID }) contentId: string,
    @Args('filters', { nullable: true }) filters?: FormFiltersInput,
  ): Promise<Form[]> {
    return this.formsService.findFormsByContent(contentId, filters);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteForm(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.formsService.deleteForm(id, user.id);
  }

  @Mutation(() => FormResponse)
  async submitFormResponse(
    @Args('createFormResponseInput') createFormResponseInput: CreateFormResponseInput,
    @CurrentUser([[], { optional: true }]) user?: User,
  ): Promise<FormResponse> {
    const formResponse = await this.formsService.submitFormResponse(createFormResponseInput, user?.id);
    
    // Guardar progreso automáticamente para usuarios 'mortal' o 'alumno'
    if (user && user.roles && await this.userProgressService.shouldAutoSave(user.roles[0])) {
      try {
        // Obtener información del formulario para extraer contentId
        const form = await this.formsService.findFormById(createFormResponseInput.formId);
        if (form && form.contentId) {
          // Buscar la actividad que tiene este formulario
          const activity = await this.formsService.findActivityByFormId(form.id);
          if (activity) {
            // Calcular puntuación basada en las respuestas
            const totalQuestions = form.questions?.length || 0;
            let correctAnswers = 0;
            
            if (formResponse.answers && form.questions) {
              for (const answer of formResponse.answers) {
                if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
                  // Para preguntas de opción múltiple
                  const question = form.questions.find(q => q.id === answer.questionId);
                  if (question) {
                    const correctOptions = question.options.filter(opt => opt.isCorrect);
                    const selectedCorrectOptions = answer.selectedOptionIds.filter(selectedId => 
                      correctOptions.some(correctOpt => correctOpt.id === selectedId)
                    );
                    if (selectedCorrectOptions.length === correctOptions.length && 
                        answer.selectedOptionIds.length === correctOptions.length) {
                      correctAnswers++;
                    }
                  }
                }
              }
            }
            
            await this.userProgressService.updateUserProgress(
              user.id,
              form.contentId,
              activity.id,
              formResponse.id,
              correctAnswers,
              totalQuestions,
            );
          }
        }
      } catch (error) {
        // Log error but don't fail the form submission
        console.error('Error updating user progress:', error);
      }
    }
    
    return formResponse;
  }

  @Query(() => FormResponse)
  async getFormResponse(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<FormResponse> {
    return this.formsService.findFormResponseById(id);
  }

  @Query(() => [FormResponse])
  @UseGuards(JwtAuthGuard)
  async getFormResponses(
    @Args('formId', { type: () => ID }) formId: string,
    @CurrentUser() user: User,
  ): Promise<FormResponse[]> {
    return this.formsService.findFormResponses(formId, user.id);
  }
}