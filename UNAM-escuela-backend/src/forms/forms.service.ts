import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form, FormQuestion, FormQuestionOption, FormResponse, FormAnswer } from './entities';
import { CreateFormInput, UpdateFormInput, CreateFormResponseInput, FormFiltersInput } from './dto';
import { Content } from '../contents/entities/content.entity';
import { User } from '../users/entities/user.entity';
import { Activity } from '../activities/entities/activity.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormQuestion)
    private readonly formQuestionRepository: Repository<FormQuestion>,
    @InjectRepository(FormQuestionOption)
    private readonly formQuestionOptionRepository: Repository<FormQuestionOption>,
    @InjectRepository(FormResponse)
    private readonly formResponseRepository: Repository<FormResponse>,
    @InjectRepository(FormAnswer)
    private readonly formAnswerRepository: Repository<FormAnswer>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async createForm(createFormInput: CreateFormInput, userId: string): Promise<Form> {
    // Verificar que el contenido existe
    const content = await this.contentRepository.findOne({
      where: { id: createFormInput.contentId },
    });
    if (!content) {
      throw new NotFoundException('Contenido no encontrado');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Crear el formulario
    const form = this.formRepository.create({
      title: createFormInput.title,
      description: createFormInput.description,
      status: 'draft',
      allowAnonymous: createFormInput.allowAnonymous,
      allowMultipleResponses: createFormInput.allowMultipleResponses,
      successMessage: createFormInput.successMessage,
      backgroundColor: createFormInput.backgroundColor,
      textColor: createFormInput.textColor,
      fontFamily: createFormInput.fontFamily,
      contentId: createFormInput.contentId,
      userId: parseInt(userId),
    });

    const savedForm = await this.formRepository.save(form);

    // Crear las preguntas si se proporcionaron
    if (createFormInput.questions && createFormInput.questions.length > 0) {
      for (const questionInput of createFormInput.questions) {
        const question = this.formQuestionRepository.create({
          questionText: questionInput.questionText,
          questionType: questionInput.questionType,
          orderIndex: questionInput.orderIndex,
          isRequired: questionInput.isRequired,
          description: questionInput.description,
          placeholder: questionInput.placeholder,
          imageUrl: questionInput.imageUrl,
          minValue: questionInput.minValue,
          maxValue: questionInput.maxValue,
          minLabel: questionInput.minLabel,
          maxLabel: questionInput.maxLabel,
          maxLength: questionInput.maxLength,
          allowMultiline: questionInput.allowMultiline,
          form: savedForm,
        });

        const savedQuestion = await this.formQuestionRepository.save(question);

        // Crear las opciones si se proporcionaron
        if (questionInput.options && questionInput.options.length > 0) {
          for (const optionInput of questionInput.options) {
            const option = this.formQuestionOptionRepository.create({
              optionText: optionInput.optionText,
              optionValue: optionInput.optionValue,
              orderIndex: optionInput.orderIndex,
              imageUrl: optionInput.imageUrl,
              color: optionInput.color,
              question: savedQuestion,
            });
            await this.formQuestionOptionRepository.save(option);
          }
        }
      }
    }

    return this.findFormById(savedForm.id);
  }

  async updateForm(updateFormInput: UpdateFormInput, userId: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id: updateFormInput.id },
      relations: ['user', 'questions', 'questions.options'],
    });

    if (!form) {
      throw new NotFoundException('Formulario no encontrado');
    }

    // Verificar que el usuario es el creador del formulario
    if (form.user && form.user.id !== userId) {
      throw new BadRequestException('No tienes permisos para editar este formulario');
    }
    
    // Si el formulario no tiene usuario asignado (formulario del sistema), no permitir edición
    if (!form.user) {
      throw new BadRequestException('No se puede editar un formulario del sistema');
    }

    // Actualizar campos del formulario
    if (updateFormInput.title !== undefined) form.title = updateFormInput.title;
    if (updateFormInput.description !== undefined) form.description = updateFormInput.description;
    if (updateFormInput.status !== undefined) form.status = updateFormInput.status;
    if (updateFormInput.allowAnonymous !== undefined) form.allowAnonymous = updateFormInput.allowAnonymous;
    if (updateFormInput.allowMultipleResponses !== undefined) form.allowMultipleResponses = updateFormInput.allowMultipleResponses;
    if (updateFormInput.successMessage !== undefined) form.successMessage = updateFormInput.successMessage;
    if (updateFormInput.backgroundColor !== undefined) form.backgroundColor = updateFormInput.backgroundColor;
    if (updateFormInput.textColor !== undefined) form.textColor = updateFormInput.textColor;
    if (updateFormInput.fontFamily !== undefined) form.fontFamily = updateFormInput.fontFamily;

    await this.formRepository.save(form);

    // Actualizar preguntas si se proporcionaron
    if (updateFormInput.questions) {
      // Eliminar preguntas existentes que no están en la actualización
      const existingQuestionIds = form.questions.map(q => q.id);
      const updatedQuestionIds = updateFormInput.questions
        .filter(q => q.id)
        .map(q => q.id);
      
      const questionsToDelete = existingQuestionIds.filter(id => !updatedQuestionIds.includes(id));
      if (questionsToDelete.length > 0) {
        await this.formQuestionRepository.delete(questionsToDelete);
      }

      // Actualizar o crear preguntas
      for (const questionInput of updateFormInput.questions) {
        if (questionInput.id) {
          // Actualizar pregunta existente
          const existingQuestion = await this.formQuestionRepository.findOne({
            where: { id: questionInput.id },
            relations: ['options'],
          });
          
          if (existingQuestion) {
            if (questionInput.questionText !== undefined) existingQuestion.questionText = questionInput.questionText;
            if (questionInput.questionType !== undefined) existingQuestion.questionType = questionInput.questionType;
            if (questionInput.orderIndex !== undefined) existingQuestion.orderIndex = questionInput.orderIndex;
            if (questionInput.isRequired !== undefined) existingQuestion.isRequired = questionInput.isRequired;
            if (questionInput.description !== undefined) existingQuestion.description = questionInput.description;
            if (questionInput.placeholder !== undefined) existingQuestion.placeholder = questionInput.placeholder;
            if (questionInput.imageUrl !== undefined) existingQuestion.imageUrl = questionInput.imageUrl;
            if (questionInput.minValue !== undefined) existingQuestion.minValue = questionInput.minValue;
            if (questionInput.maxValue !== undefined) existingQuestion.maxValue = questionInput.maxValue;
            if (questionInput.minLabel !== undefined) existingQuestion.minLabel = questionInput.minLabel;
            if (questionInput.maxLabel !== undefined) existingQuestion.maxLabel = questionInput.maxLabel;
            if (questionInput.maxLength !== undefined) existingQuestion.maxLength = questionInput.maxLength;
            if (questionInput.allowMultiline !== undefined) existingQuestion.allowMultiline = questionInput.allowMultiline;

            await this.formQuestionRepository.save(existingQuestion);

            // Actualizar opciones
            if (questionInput.options) {
              const existingOptionIds = existingQuestion.options.map(o => o.id);
              const updatedOptionIds = questionInput.options
                .filter(o => o.id)
                .map(o => o.id);
              
              const optionsToDelete = existingOptionIds.filter(id => !updatedOptionIds.includes(id));
              if (optionsToDelete.length > 0) {
                await this.formQuestionOptionRepository.delete(optionsToDelete);
              }

              for (const optionInput of questionInput.options) {
                if (optionInput.id) {
                  // Actualizar opción existente
                  const existingOption = await this.formQuestionOptionRepository.findOne({
                    where: { id: optionInput.id },
                  });
                  
                  if (existingOption) {
                    if (optionInput.optionText !== undefined) existingOption.optionText = optionInput.optionText;
                    if (optionInput.optionValue !== undefined) existingOption.optionValue = optionInput.optionValue;
                    if (optionInput.orderIndex !== undefined) existingOption.orderIndex = optionInput.orderIndex;
                    if (optionInput.imageUrl !== undefined) existingOption.imageUrl = optionInput.imageUrl;
                    if (optionInput.color !== undefined) existingOption.color = optionInput.color;
                    if (optionInput.isCorrect !== undefined) existingOption.isCorrect = optionInput.isCorrect;

                    await this.formQuestionOptionRepository.save(existingOption);
                  }
                } else {
                  // Crear nueva opción
                  const newOption = this.formQuestionOptionRepository.create({
                    optionText: optionInput.optionText,
                    optionValue: optionInput.optionValue,
                    orderIndex: optionInput.orderIndex,
                    imageUrl: optionInput.imageUrl,
                    color: optionInput.color,
                    isCorrect: optionInput.isCorrect,
                    question: existingQuestion,
                  });
                  await this.formQuestionOptionRepository.save(newOption);
                }
              }
            }
          }
        } else {
          // Crear nueva pregunta
          const newQuestion = this.formQuestionRepository.create({
            questionText: questionInput.questionText,
            questionType: questionInput.questionType,
            orderIndex: questionInput.orderIndex,
            isRequired: questionInput.isRequired,
            description: questionInput.description,
            placeholder: questionInput.placeholder,
            imageUrl: questionInput.imageUrl,
            minValue: questionInput.minValue,
            maxValue: questionInput.maxValue,
            minLabel: questionInput.minLabel,
            maxLabel: questionInput.maxLabel,
            maxLength: questionInput.maxLength,
            allowMultiline: questionInput.allowMultiline,
            form: form,
          });

          const savedQuestion = await this.formQuestionRepository.save(newQuestion);

          // Crear opciones para la nueva pregunta
          if (questionInput.options && questionInput.options.length > 0) {
            for (const optionInput of questionInput.options) {
              const option = this.formQuestionOptionRepository.create({
                optionText: optionInput.optionText,
                optionValue: optionInput.optionValue,
                orderIndex: optionInput.orderIndex,
                imageUrl: optionInput.imageUrl,
                color: optionInput.color,
                isCorrect: optionInput.isCorrect,
                question: savedQuestion,
              });
              await this.formQuestionOptionRepository.save(option);
            }
          }
        }
      }
    }

    return this.findFormById(form.id);
  }

  async findFormById(id: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: [
        'content',
        'user',
        'questions',
        'questions.options',
        'responses',
        'responses.answers',
        'responses.answers.question',
      ],
      order: {
        questions: {
          orderIndex: 'ASC',
          options: {
            orderIndex: 'ASC',
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Formulario no encontrado');
    }

    return form;
  }

  async findFormsByContent(contentId: string, filters?: FormFiltersInput): Promise<Form[]> {
    const queryBuilder = this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.content', 'content')
      .leftJoinAndSelect('form.user', 'user')
      .leftJoinAndSelect('form.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .where('content.id = :contentId', { contentId })
      .orderBy('form.createdAt', 'DESC')
      .addOrderBy('questions.orderIndex', 'ASC')
      .addOrderBy('options.orderIndex', 'ASC');

    if (filters?.search) {
      queryBuilder.andWhere(
        '(form.title ILIKE :search OR form.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.status) {
      queryBuilder.andWhere('form.status = :status', { status: filters.status });
    }

    if (filters?.page && filters?.limit) {
      const skip = (filters.page - 1) * filters.limit;
      queryBuilder.skip(skip).take(filters.limit);
    }

    return queryBuilder.getMany();
  }

  async deleteForm(id: string, userId: string): Promise<boolean> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!form) {
      throw new NotFoundException('Formulario no encontrado');
    }

    // Verificar que el usuario es el creador del formulario
    if (form.user && form.user.id !== userId) {
      throw new BadRequestException('No tienes permisos para eliminar este formulario');
    }
    
    // Si el formulario no tiene usuario asignado (formulario del sistema), no permitir eliminación
    if (!form.user) {
      throw new BadRequestException('No se puede eliminar un formulario del sistema');
    }

    await this.formRepository.remove(form);
    return true;
  }

  async submitFormResponse(createFormResponseInput: CreateFormResponseInput, userId?: string): Promise<FormResponse> {
    const form = await this.formRepository.findOne({
      where: { id: createFormResponseInput.formId },
      relations: ['questions', 'questions.options'],
    });

    if (!form) {
      throw new NotFoundException('Formulario no encontrado');
    }

    if (form.status !== 'published') {
      throw new BadRequestException('El formulario no está publicado');
    }

    // Verificar si el usuario ya respondió (si no permite múltiples respuestas)
    if (!form.allowMultipleResponses && userId) {
      const existingResponse = await this.formResponseRepository.findOne({
        where: { formId: form.id, userId: parseInt(userId) },
      });

      if (existingResponse) {
        throw new BadRequestException('Ya has respondido este formulario');
      }
    }

    // Validar respuestas requeridas
    const requiredQuestions = form.questions.filter(q => q.isRequired);
    const answeredQuestionIds = createFormResponseInput.answers.map(a => a.questionId);
    
    for (const requiredQuestion of requiredQuestions) {
      if (!answeredQuestionIds.includes(requiredQuestion.id)) {
        throw new BadRequestException(`La pregunta "${requiredQuestion.questionText}" es obligatoria`);
      }
    }

    // Crear la respuesta
    const formResponse = this.formResponseRepository.create({
      respondentName: createFormResponseInput.respondentName,
      respondentEmail: createFormResponseInput.respondentEmail,
      isAnonymous: createFormResponseInput.isAnonymous,
      status: 'completed',
      formId: form.id,
      userId: userId ? parseInt(userId) : undefined,
    });

    const savedResponse = await this.formResponseRepository.save(formResponse);

    // Crear las respuestas individuales
    for (const answerInput of createFormResponseInput.answers) {
      const question = form.questions.find(q => q.id === answerInput.questionId);
      if (!question) {
        throw new BadRequestException(`Pregunta no encontrada: ${answerInput.questionId}`);
      }

      const answer = this.formAnswerRepository.create({
        textAnswer: answerInput.textAnswer,
        selectedOptionIds: answerInput.selectedOptionIds,
        numericAnswer: answerInput.numericAnswer,
        booleanAnswer: answerInput.booleanAnswer,
        questionId: answerInput.questionId,
        responseId: savedResponse.id,
      });

      await this.formAnswerRepository.save(answer);
    }

    return this.findFormResponseById(savedResponse.id);
  }

  async findFormResponseById(id: string): Promise<FormResponse> {
    const response = await this.formResponseRepository.findOne({
      where: { id },
      relations: [
        'form',
        'user',
        'answers',
        'answers.question',
        'answers.question.options',
      ],
    });

    if (!response) {
      throw new NotFoundException('Respuesta no encontrada');
    }

    return response;
  }

  async findFormResponses(formId: string, userId: string): Promise<FormResponse[]> {
    const form = await this.formRepository.findOne({
      where: { id: formId },
      relations: ['user'],
    });

    if (!form) {
      throw new NotFoundException('Formulario no encontrado');
    }

    // Verificar que el usuario es el creador del formulario
    if (form.user && form.user.id !== userId) {
      throw new BadRequestException('No tienes permisos para ver las respuestas de este formulario');
    }
    
    // Si el formulario no tiene usuario asignado (formulario del sistema), permitir acceso
    if (!form.user) {
      // Los formularios del sistema pueden ser accedidos por cualquier usuario autorizado
    }

    return this.formResponseRepository.find({
      where: { formId: formId },
      relations: [
        'user',
        'answers',
        'answers.question',
        'answers.question.options',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findActivityByFormId(formId: string): Promise<Activity | null> {
    return await this.activityRepository.findOne({
      where: { formId },
    });
  }
}