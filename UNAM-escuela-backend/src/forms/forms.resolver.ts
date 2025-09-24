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

  /**
   * Evalúa si una respuesta de texto es correcta usando múltiples criterios
   */
  private evaluateTextAnswer(userAnswer: string, correctAnswer: string): boolean {
    if (!userAnswer || !correctAnswer) return false;
    
    const userText = userAnswer.toLowerCase().trim();
    const correctText = correctAnswer.toLowerCase().trim();
    
    // Solo comparación exacta para preguntas de texto abierto
    // Esto asegura que la respuesta sea exactamente la esperada
    return userText === correctText;
  }

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
    console.log('🚀 BACKEND SUBMIT FORM RESPONSE - INPUT:', {
           formId: createFormResponseInput.formId,
           userId: user?.id || 'anonymous',
           answersCount: createFormResponseInput.answers?.length || 0,
           answers: createFormResponseInput.answers
         });
    
    const formResponse = await this.formsService.submitFormResponse(createFormResponseInput, user?.id);
    
    console.log('✅ FORM RESPONSE CREATED:', {
      responseId: formResponse.id,
      answersCount: formResponse.answers?.length || 0
    });
    
    console.log('🔍 USER INFO FOR EVALUATION:', {
      hasUser: !!user,
      userId: user?.id,
      userRoles: user?.roles,
      shouldEvaluate: true
    });
    
    // Obtener información del formulario para extraer contentId
    const form = await this.formsService.findFormById(createFormResponseInput.formId);
    
    // Evaluar si el formulario tiene contentId (sin requerir usuario)
    if (form && form.contentId) {
      // Buscar la actividad que tiene este formulario
      const activity = await this.formsService.findActivityByFormId(form.id);
      if (activity) {
        // Calcular puntuación basada en las respuestas
        const totalQuestions = form.questions?.length || 0;
        let correctAnswers = 0;
        
        console.log('🔍 STARTING EVALUATION PROCESS:', {
          totalQuestions,
          hasAnswers: !!formResponse.answers,
          hasQuestions: !!form.questions,
          answersCount: formResponse.answers?.length || 0,
          questionsCount: form.questions?.length || 0
        });
        
        if (formResponse.answers && form.questions) {
          for (const answer of formResponse.answers) {
            const question = form.questions.find(q => q.id === answer.questionId);
            
            console.log('🔍 PROCESSING ANSWER:', {
              questionId: answer.questionId,
              questionFound: !!question,
              questionText: question?.questionText?.substring(0, 50) + '...',
              questionType: question?.questionType,
              hasSelectedOptionIds: !!answer.selectedOptionIds,
              hasSelectedOptionId: !!answer.selectedOptionId,
              hasTextAnswer: !!answer.textAnswer
            });
            
            if (question) {
              let isCorrect = false;
              let feedback = '';
              
              // Para preguntas de opción múltiple (array de opciones seleccionadas)
              if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
                const correctOptions = question.options.filter(opt => opt.isCorrect);
                const selectedCorrectOptions = answer.selectedOptionIds.filter(selectedId => 
                  correctOptions.some(correctOpt => correctOpt.id === selectedId)
                );
                const selectedIncorrectOptions = answer.selectedOptionIds.filter(selectedId => 
                  question.options.some(opt => opt.id === selectedId && !opt.isCorrect)
                );
                
                // Respuesta correcta si:
                // 1. Seleccionó todas las opciones correctas
                // 2. No seleccionó ninguna opción incorrecta
                isCorrect = selectedCorrectOptions.length === correctOptions.length && 
                           selectedIncorrectOptions.length === 0;
                
                if (isCorrect) {
                  correctAnswers++;
                  feedback = '¡Correcto! Has seleccionado todas las opciones correctas.';
                } else {
                  const correctTexts = correctOptions.map(opt => opt.optionText).join(', ');
                  feedback = `Incorrecto. Las respuestas correctas son: ${correctTexts}`;
                }
                
                console.log('🔍 BACKEND MULTIPLE CHOICE EVALUATION:', {
                  questionId: question.id,
                  questionType: question.questionType,
                  selectedOptionIds: answer.selectedOptionIds,
                  correctOptions: correctOptions.map(opt => ({ id: opt.id, text: opt.optionText })),
                  selectedCorrectOptions,
                  selectedIncorrectOptions,
                  isCorrect
                });
              }
              // Para preguntas de selección única
              else if (answer.selectedOptionId) {
                const selectedOption = question.options.find(opt => opt.id === answer.selectedOptionId);
                isCorrect = !!(selectedOption && selectedOption.isCorrect);
                
                if (isCorrect) {
                  correctAnswers++;
                  feedback = '¡Correcto!';
                } else {
                  const correctOption = question.options.find(opt => opt.isCorrect);
                  feedback = correctOption ? `Incorrecto. La respuesta correcta es: ${correctOption.optionText}` : 'Incorrecto.';
                }
                
                console.log('🔍 BACKEND SINGLE CHOICE EVALUATION:', {
                  questionId: question.id,
                  questionType: question.questionType,
                  selectedOptionId: answer.selectedOptionId,
                  selectedOption: selectedOption ? { id: selectedOption.id, text: selectedOption.optionText, isCorrect: selectedOption.isCorrect } : null,
                  isCorrect
                });
              }
              // Para preguntas de texto
              else if (answer.textAnswer && question.correctAnswer) {
                isCorrect = this.evaluateTextAnswer(answer.textAnswer, question.correctAnswer);
                if (isCorrect) {
                  correctAnswers++;
                  feedback = '¡Correcto!';
                } else {
                  feedback = `Incorrecto. La respuesta correcta es: ${question.correctAnswer}`;
                }
                console.log('🔍 BACKEND TEXT EVALUATION:', {
                  questionId: question.id,
                  questionType: question.questionType,
                  userAnswer: answer.textAnswer,
                  correctAnswer: question.correctAnswer,
                  isCorrect
                });
              }
              
              // Guardar los resultados de evaluación en la respuesta
              await this.formsService.updateAnswerEvaluation(answer.id, isCorrect, feedback);
            }
          }
        }
        
        // Guardar progreso automáticamente para usuarios 'mortal' o 'alumno', o crear progreso anónimo
        if (user && user.roles && await this.userProgressService.shouldAutoSave(user.roles[0])) {
          try {
            await this.userProgressService.updateUserProgress(
              user.id,
              form.contentId,
              activity.id,
              formResponse.id,
              correctAnswers,
              totalQuestions,
            );
          } catch (error) {
            // Log error but don't fail the form submission
            console.error('Error updating user progress:', error);
          }
        }
      }
    }
    
    // Código anterior para usuarios autenticados (mantener compatibilidad)
    if (user && user.roles && await this.userProgressService.shouldAutoSave(user.roles[0])) {
      // Este bloque ya se ejecutó arriba, mantener para compatibilidad
    }
    
    // Devolver la respuesta actualizada con los campos de evaluación
    return this.formsService.findFormResponseById(formResponse.id);
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