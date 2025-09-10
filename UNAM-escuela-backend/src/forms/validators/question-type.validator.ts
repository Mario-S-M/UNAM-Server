import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

/**
 * Validador personalizado para tipos de preguntas de formularios dinámicos
 * Valida que cada tipo de pregunta tenga los campos requeridos y configuración correcta
 */
@ValidatorConstraint({ name: 'questionTypeValidator', async: false })
export class QuestionTypeValidatorConstraint implements ValidatorConstraintInterface {
  validate(question: any, args: ValidationArguments) {
    if (!question || !question.questionType) {
      return false;
    }

    const { questionType } = question;

    switch (questionType) {
      case 'TEXT':
      case 'TEXTAREA':
      case 'open_text':
        return this.validateTextQuestion(question);
      
      case 'MULTIPLE_CHOICE':
        return this.validateMultipleChoiceQuestion(question);
      
      case 'CHECKBOX':
        return this.validateCheckboxQuestion(question);
      
      case 'RATING_SCALE':
        return this.validateRatingScaleQuestion(question);
      
      case 'NUMBER':
        return this.validateNumberQuestion(question);
      
      case 'EMAIL':
        return this.validateEmailQuestion(question);
      
      case 'DATE':
      case 'TIME':
        return this.validateDateTimeQuestion(question);
      
      case 'BOOLEAN':
        return this.validateBooleanQuestion(question);
      
      default:
        return false;
    }
  }

  private validateTextQuestion(question: any): boolean {
    // Las preguntas de texto pueden tener maxLength opcional
    if (question.maxLength && (typeof question.maxLength !== 'number' || question.maxLength <= 0)) {
      return false;
    }
    
    // Para preguntas open_text, debe tener correctAnswer si es evaluable
    if (question.questionType === 'open_text' && question.points && question.points > 0) {
      return question.correctAnswer && question.correctAnswer.trim().length > 0;
    }
    
    return true;
  }

  private validateMultipleChoiceQuestion(question: any): boolean {
    // Debe tener opciones
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      return false;
    }
    
    // Cada opción debe tener texto
    const hasValidOptions = question.options.every((option: any) => 
      option.optionText && option.optionText.trim().length > 0
    );
    
    if (!hasValidOptions) {
      return false;
    }
    
    // Si es evaluable (tiene puntos), debe tener al menos una respuesta correcta
    if (question.points && question.points > 0) {
      return question.options.some((option: any) => option.isCorrect === true);
    }
    
    return true;
  }

  private validateCheckboxQuestion(question: any): boolean {
    // Similar a multiple choice pero permite selección única
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      return false;
    }
    
    const hasValidOptions = question.options.every((option: any) => 
      option.optionText && option.optionText.trim().length > 0
    );
    
    if (!hasValidOptions) {
      return false;
    }
    
    // Si es evaluable, debe tener exactamente una respuesta correcta
    if (question.points && question.points > 0) {
      const correctOptions = question.options.filter((option: any) => option.isCorrect === true);
      return correctOptions.length === 1;
    }
    
    return true;
  }

  private validateRatingScaleQuestion(question: any): boolean {
    // Debe tener minValue y maxValue válidos
    if (!question.minValue || !question.maxValue) {
      return false;
    }
    
    if (typeof question.minValue !== 'number' || typeof question.maxValue !== 'number') {
      return false;
    }
    
    if (question.minValue >= question.maxValue) {
      return false;
    }
    
    // El rango debe ser razonable (entre 2 y 10 puntos)
    const range = question.maxValue - question.minValue + 1;
    if (range < 2 || range > 10) {
      return false;
    }
    
    return true;
  }

  private validateNumberQuestion(question: any): boolean {
    // Si tiene minValue y maxValue, deben ser válidos
    if (question.minValue !== undefined && question.maxValue !== undefined) {
      if (typeof question.minValue !== 'number' || typeof question.maxValue !== 'number') {
        return false;
      }
      
      if (question.minValue >= question.maxValue) {
        return false;
      }
    }
    
    return true;
  }

  private validateEmailQuestion(question: any): boolean {
    // Las preguntas de email no requieren validación especial
    // La validación del formato se hace en el frontend
    return true;
  }

  private validateDateTimeQuestion(question: any): boolean {
    // Las preguntas de fecha/hora no requieren validación especial
    return true;
  }

  private validateBooleanQuestion(question: any): boolean {
    // Las preguntas booleanas no requieren configuración especial
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const question = args.object as any;
    const { questionType } = question;

    switch (questionType) {
      case 'TEXT':
      case 'TEXTAREA':
      case 'open_text':
        if (question.questionType === 'open_text' && question.points && question.points > 0) {
          return 'Las preguntas de texto abierto evaluables deben tener una respuesta correcta';
        }
        return 'Configuración inválida para pregunta de texto';
      
      case 'MULTIPLE_CHOICE':
        if (!question.options || question.options.length < 2) {
          return 'Las preguntas de opción múltiple deben tener al menos 2 opciones';
        }
        if (question.points && question.points > 0) {
          return 'Las preguntas de opción múltiple evaluables deben tener al menos una respuesta correcta';
        }
        return 'Configuración inválida para pregunta de opción múltiple';
      
      case 'CHECKBOX':
        if (!question.options || question.options.length < 2) {
          return 'Las preguntas de selección deben tener al menos 2 opciones';
        }
        if (question.points && question.points > 0) {
          return 'Las preguntas de selección evaluables deben tener exactamente una respuesta correcta';
        }
        return 'Configuración inválida para pregunta de selección';
      
      case 'RATING_SCALE':
        return 'Las preguntas de escala deben tener valores mínimo y máximo válidos (rango de 2-10 puntos)';
      
      case 'NUMBER':
        return 'Configuración inválida para pregunta numérica';
      
      case 'EMAIL':
      case 'DATE':
      case 'TIME':
      case 'BOOLEAN':
        return `Configuración inválida para pregunta de tipo ${questionType}`;
      
      default:
        return `Tipo de pregunta no soportado: ${questionType}`;
    }
  }
}

/**
 * Validador para respuestas de formularios dinámicos
 * Valida que las respuestas coincidan con el tipo de pregunta
 */
@ValidatorConstraint({ name: 'answerTypeValidator', async: false })
export class AnswerTypeValidatorConstraint implements ValidatorConstraintInterface {
  validate(answer: any, args: ValidationArguments) {
    if (!answer || !answer.questionType) {
      return false;
    }

    const { questionType, answerValue } = answer;

    // Si no hay respuesta y la pregunta no es requerida, es válido
    if (!answerValue && !answer.isRequired) {
      return true;
    }

    // Si no hay respuesta y la pregunta es requerida, es inválido
    if (!answerValue && answer.isRequired) {
      return false;
    }

    switch (questionType) {
      case 'TEXT':
      case 'TEXTAREA':
      case 'open_text':
      case 'EMAIL':
        return typeof answerValue === 'string' && answerValue.trim().length > 0;
      
      case 'NUMBER':
        return typeof answerValue === 'number' && !isNaN(answerValue);
      
      case 'MULTIPLE_CHOICE':
        return Array.isArray(answerValue) && answerValue.length > 0;
      
      case 'CHECKBOX':
      case 'BOOLEAN':
        return typeof answerValue === 'string' && answerValue.length > 0;
      
      case 'RATING_SCALE':
        return typeof answerValue === 'number' && answerValue >= (answer.minValue || 1) && answerValue <= (answer.maxValue || 5);
      
      case 'DATE':
        return typeof answerValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(answerValue);
      
      case 'TIME':
        return typeof answerValue === 'string' && /^\d{2}:\d{2}$/.test(answerValue);
      
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const answer = args.object as any;
    const { questionType } = answer;

    return `Respuesta inválida para pregunta de tipo ${questionType}`;
  }
}