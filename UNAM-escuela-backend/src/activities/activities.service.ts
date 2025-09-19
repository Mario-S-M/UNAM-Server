import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Form } from '../forms/entities/form.entity';
import { FormQuestion } from '../forms/entities/form-question.entity';
import { FormQuestionOption } from '../forms/entities/form-question-option.entity';
import { TimeCalculationService } from '../common/services/time-calculation.service';

@Injectable()
export class ActivitiesService {

  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormQuestion)
    private readonly formQuestionRepository: Repository<FormQuestion>,
    @InjectRepository(FormQuestionOption)
    private readonly formQuestionOptionRepository: Repository<FormQuestionOption>,
    private readonly timeCalculationService: TimeCalculationService,
  ) {}

    async create(createActivityInput: CreateActivityInput): Promise<Activity> {
      let formId = createActivityInput.formId;

      // Si se proporcionan preguntas, crear un formulario automáticamente
      if (createActivityInput.questions && createActivityInput.questions.length > 0) {
        const form = this.formRepository.create({
          title: `Formulario para ${createActivityInput.name}`,
          description: `Formulario generado automáticamente para la actividad: ${createActivityInput.name}`,
          status: 'published',
          allowAnonymous: true,
          allowMultipleResponses: true,
          contentId: createActivityInput.contentId,
          // userId se omite para formularios del sistema
        });

        const savedForm = await this.formRepository.save(form);
        formId = savedForm.id;

        // Crear las preguntas
        for (const questionInput of createActivityInput.questions) {
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
            correctAnswer: questionInput.correctAnswer,
            explanation: questionInput.explanation,
            incorrectFeedback: questionInput.incorrectFeedback,
            points: questionInput.points,
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
                isCorrect: optionInput.isCorrect,
                question: savedQuestion,
              });
              await this.formQuestionOptionRepository.save(option);
            }
          }
        }
      }

      const newActivity = this.activitiesRepository.create({
        ...createActivityInput,
        formId,
      });
      const savedActivity = await this.activitiesRepository.save(newActivity);
      
      // Recalcular tiempos en cascada
      await this.timeCalculationService.recalculateTimesForActivity(savedActivity.id);
      
      // Cargar la actividad con las relaciones para retornar los datos completos
      const activityWithRelations = await this.activitiesRepository.findOne({
        where: { id: savedActivity.id },
        relations: ['form', 'form.questions', 'form.questions.options']
      });
      
      if (!activityWithRelations) {
        throw new NotFoundException(`Activity with ID ${savedActivity.id} not found`);
      }
      
      return activityWithRelations;
    }
  
  async findAll():Promise<Activity[]> {
    return await this.activitiesRepository.find({
      relations: ['form', 'form.questions', 'form.questions.options']
    });
  }

  async findByContent(contentId: string):Promise<Activity[]> {
    return await this.activitiesRepository.find({
      where: {contentId},
      relations: ['form', 'form.questions', 'form.questions.options']
    });
  }

  async findExercisesByContent(contentId: string):Promise<Activity[]> {
    return await this.activitiesRepository.find({
      where: {
        contentId
        // Temporalmente removido el filtro de status 'published'
        // form: {
        //   status: 'published'
        // }
      },
      relations: ['form', 'form.questions', 'form.questions.options'],
      order: {
        createdAt: 'ASC',
        form: {
          questions: {
            orderIndex: 'ASC',
            options: {
              orderIndex: 'ASC'
            }
          }
        }
      }
    });
  }

  async findOne(id: string):Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({
      where: {id},
      relations: ['form', 'form.questions', 'form.questions.options']
    });
    if (!activity) throw new NotFoundException('Actividad no encontrada');
    return activity;
  }

  async update(id: string, updateActivityInput: UpdateActivityInput):Promise<Activity> {
    console.log('=== UPDATE ACTIVITY DEBUG ===');
    console.log('Activity ID:', id);
    console.log('Update input:', JSON.stringify(updateActivityInput, null, 2));
    
    const activity = await this.findOne(id);
    console.log('Current activity:', JSON.stringify(activity, null, 2));
    
    if (updateActivityInput.name) activity.name = updateActivityInput.name;
    if (updateActivityInput.description) activity.description = updateActivityInput.description;
    if (updateActivityInput.indication) activity.indication = updateActivityInput.indication;
    if (updateActivityInput.example) activity.example = updateActivityInput.example;
    if (updateActivityInput.formId !== undefined) activity.formId = updateActivityInput.formId;
    if (updateActivityInput.estimatedTime !== undefined) activity.estimatedTime = updateActivityInput.estimatedTime;

    // Si se proporcionan preguntas, actualizar o crear formulario
    if (updateActivityInput.questions) {
      console.log('Questions provided:', updateActivityInput.questions.length);
      let formId = activity.formId;

      if (!formId) {
        // Crear nuevo formulario si no existe
        const form = this.formRepository.create({
          title: `Formulario para ${activity.name}`,
          description: `Formulario generado automáticamente para la actividad: ${activity.name}`,
          status: 'published',
          allowAnonymous: true,
          allowMultipleResponses: true,
          contentId: activity.contentId,
          // userId se omite para formularios del sistema
        });
        const savedForm = await this.formRepository.save(form);
        formId = savedForm.id;
        activity.formId = formId;
        console.log('Created new form with ID:', formId);
      }

      // Obtener el formulario existente
      const form = await this.formRepository.findOne({
        where: { id: formId },
        relations: ['questions', 'questions.options'],
      });
      console.log('Form found:', form ? 'YES' : 'NO');
      console.log('Form ID:', formId);

      if (form) {
        console.log('Existing questions count:', form.questions?.length || 0);
        
        // Eliminar opciones de preguntas existentes primero
        if (form.questions && form.questions.length > 0) {
          for (const question of form.questions) {
            if (question.options && question.options.length > 0) {
              console.log('Deleting options for question:', question.id);
              await this.formQuestionOptionRepository.delete(
                question.options.map(o => o.id)
              );
            }
          }
          
          // Luego eliminar las preguntas
          console.log('Deleting existing questions:', form.questions.map(q => q.id));
          await this.formQuestionRepository.delete(
            form.questions.map(q => q.id)
          );
        }

        // Crear nuevas preguntas
        console.log('Creating new questions:', updateActivityInput.questions.length);
        for (const questionInput of updateActivityInput.questions) {
          console.log('Creating question:', questionInput.questionText);
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
            correctAnswer: questionInput.correctAnswer,
            explanation: questionInput.explanation,
            incorrectFeedback: questionInput.incorrectFeedback,
            points: questionInput.points,
            form: form,
          });

          const savedQuestion = await this.formQuestionRepository.save(question);
          console.log('Saved question with ID:', savedQuestion.id);

          // Crear opciones si se proporcionaron
          if (questionInput.options && questionInput.options.length > 0) {
            console.log('Creating options for question:', savedQuestion.id, 'Count:', questionInput.options.length);
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
              const savedOption = await this.formQuestionOptionRepository.save(option);
              console.log('Saved option with ID:', savedOption.id);
            }
          }
        }
      }
    }

    console.log('Saving activity with formId:', activity.formId);
    const savedActivity = await this.activitiesRepository.save(activity);
    console.log('Activity saved successfully with ID:', savedActivity.id);
    
    // Recalcular tiempos en cascada
    await this.timeCalculationService.recalculateTimesForActivity(savedActivity.id);
    
    console.log('=== END UPDATE ACTIVITY DEBUG ===');
    return savedActivity;
  }

  async remove(id: string):Promise<Activity> {
    const activity = await this.findOne(id);
    const contentId = activity.contentId;
    
    await this.activitiesRepository.remove(activity);
    
    // Recalcular tiempos en cascada después de eliminar la actividad
    if (contentId) {
      await this.timeCalculationService.updateContentCalculatedTime(contentId);
      // El servicio de tiempo se encargará de propagar los cambios hacia arriba
    }
    
    return { ...activity, id };
  }

  async removeByContentId(contentId: string): Promise<void> {
    const activities = await this.activitiesRepository.find({
      where: { contentId },
      relations: ['form']
    });

    // Eliminar formularios asociados si existen
    for (const activity of activities) {
      if (activity.form) {
        // Eliminar preguntas y opciones del formulario
        const questions = await this.formQuestionRepository.find({
          where: { formId: activity.form.id },
          relations: ['options']
        });

        for (const question of questions) {
          if (question.options && question.options.length > 0) {
            await this.formQuestionOptionRepository.remove(question.options);
          }
        }

        if (questions.length > 0) {
          await this.formQuestionRepository.remove(questions);
        }

        // Eliminar el formulario
        await this.formRepository.remove(activity.form);
      }
    }

    // Eliminar todas las actividades
    if (activities.length > 0) {
      await this.activitiesRepository.remove(activities);
    }
  }
}
