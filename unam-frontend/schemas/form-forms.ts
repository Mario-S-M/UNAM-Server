import { z } from 'zod';

/**
 * Esquemas Zod para formularios dinámicos
 * 
 * Define la validación y tipos para la creación, actualización y gestión
 * de formularios dinámicos con múltiples tipos de preguntas.
 */

// Enum para tipos de preguntas
export const QuestionTypeEnum = z.enum([
  'TEXT',
  'TEXTAREA',
  'open_text',
  'MULTIPLE_CHOICE',
  'CHECKBOX',
  'RATING_SCALE',
  'NUMBER',
  'EMAIL',
  'DATE',
  'TIME',
  'BOOLEAN',
  'WORD_SEARCH',
  'CROSSWORD'
]);

// Enum para estados de formulario
export const FormStatusEnum = z.enum([
  'DRAFT',
  'PUBLISHED', 
  'CLOSED',
  'ARCHIVED'
]);

// Esquema para opciones de preguntas
export const FormQuestionOptionSchema = z.object({
  id: z.string().optional(),
  optionText: z.string().min(1, 'El texto de la opción es requerido'),
  optionValue: z.string().min(1, 'El valor de la opción es requerido'),
  orderIndex: z.number().min(0, 'El índice debe ser mayor o igual a 0'),
  imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  color: z.string().optional(),
  isCorrect: z.boolean().default(false)
});

// Esquema para preguntas de formulario
export const FormQuestionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(1, 'El texto de la pregunta es requerido'),
  questionType: QuestionTypeEnum,
  orderIndex: z.number().min(0, 'El índice debe ser mayor o igual a 0'),
  isRequired: z.boolean().default(true),
  allowMultiline: z.boolean().default(false),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  audioUrl: z.string().url('URL de audio inválida').optional().or(z.literal('')),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  maxLength: z.number().min(1).optional(),
  correctAnswer: z.string().optional(),
  correctOptionIds: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  incorrectFeedback: z.string().optional(),
  points: z.number().min(0).optional(),
  options: z.array(FormQuestionOptionSchema).optional(),
  // Campos específicos para sopa de letras
  sentences: z.array(z.string()).optional(),
  phrases: z.array(z.string()).optional(),
  gridSize: z.number().min(5).max(20).optional()
}).refine((data) => {
  // Validar que preguntas de opción múltiple y checkbox tengan opciones
  if (['MULTIPLE_CHOICE', 'CHECKBOX'].includes(data.questionType)) {
    return data.options && data.options.length > 0;
  }
  return true;
}, {
  message: 'Las preguntas de opción múltiple y checkbox deben tener al menos una opción',
  path: ['options']
}).refine((data) => {
  // Validar que escalas de rating tengan valores min y max
  if (data.questionType === 'RATING_SCALE') {
    return data.minValue !== undefined && data.maxValue !== undefined && data.minValue < data.maxValue;
  }
  return true;
}, {
  message: 'Las escalas de rating deben tener valores mínimo y máximo válidos',
  path: ['minValue', 'maxValue']
});

// Esquema base para formularios
export const BaseFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'El título no puede exceder 255 caracteres'),
  description: z.string().optional(),
  status: FormStatusEnum.default('DRAFT'),
  allowAnonymous: z.boolean().default(true),
  allowMultipleResponses: z.boolean().default(false),
  successMessage: z.string().optional(),
  primaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  fontFamily: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  closedAt: z.string().datetime().optional()
});

// Esquema para crear formulario
export const CreateFormSchema = BaseFormSchema.extend({
  contentId: z.string().min(1, 'El ID del contenido es requerido'),
  questions: z.array(FormQuestionSchema).min(1, 'El formulario debe tener al menos una pregunta')
});

// Esquema para actualizar formulario
export const UpdateFormSchema = BaseFormSchema.extend({
  id: z.string().min(1, 'El ID del formulario es requerido'),
  questions: z.array(FormQuestionSchema).optional()
}).partial().required({ id: true });

// Esquema para filtros de formularios
export const FormFiltersSchema = z.object({
  search: z.string().optional(),
  status: FormStatusEnum.optional(),
  contentId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['title', 'status', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Esquema para ID de formulario
export const FormIdSchema = z.object({
  id: z.string().min(1, 'El ID del formulario es requerido')
});

// Esquemas para respuestas de formularios
export const FormAnswerSchema = z.object({
  questionId: z.string().min(1, 'El ID de la pregunta es requerido'),
  questionType: QuestionTypeEnum,
  textAnswer: z.string().optional(),
  selectedOptionIds: z.array(z.string()).optional(),
  numericAnswer: z.string().optional(),
  booleanAnswer: z.boolean().optional()
}).refine((data) => {
  // Al menos un tipo de respuesta debe estar presente
  const hasAnswer = data.textAnswer !== undefined || 
                   (data.selectedOptionIds && data.selectedOptionIds.length > 0) ||
                   data.numericAnswer !== undefined ||
                   data.booleanAnswer !== undefined;
  return hasAnswer;
}, {
  message: 'Debe proporcionar al menos un tipo de respuesta',
  path: ['textAnswer']
});

export const CreateFormResponseSchema = z.object({
  formId: z.string().min(1, 'El ID del formulario es requerido'),
  respondentName: z.string().optional(),
  respondentEmail: z.string().email('Email inválido').optional(),
  isAnonymous: z.boolean().default(false),
  answers: z.array(FormAnswerSchema).min(1, 'Debe proporcionar al menos una respuesta')
});

// Tipos derivados de los esquemas
export type QuestionType = z.infer<typeof QuestionTypeEnum>;
export type FormStatus = z.infer<typeof FormStatusEnum>;
export type FormQuestionOptionData = z.infer<typeof FormQuestionOptionSchema>;
export type FormQuestionData = z.infer<typeof FormQuestionSchema>;
export type CreateFormFormData = z.infer<typeof CreateFormSchema>;
export type UpdateFormFormData = z.infer<typeof UpdateFormSchema>;
export type FormFiltersData = z.infer<typeof FormFiltersSchema>;
export type FormIdData = z.infer<typeof FormIdSchema>;
export type FormAnswerData = z.infer<typeof FormAnswerSchema>;
export type CreateFormResponseData = z.infer<typeof CreateFormResponseSchema>;

// Constantes para uso en componentes
export const QUESTION_TYPES: QuestionType[] = [
  'TEXT',
  'TEXTAREA',
  'open_text',
  'MULTIPLE_CHOICE', 
  'CHECKBOX',
  'RATING_SCALE',
  'NUMBER',
  'EMAIL',
  'DATE',
  'TIME',
  'BOOLEAN',
  'WORD_SEARCH',
  'CROSSWORD'
];

export const FORM_STATUSES: FormStatus[] = [
  'DRAFT',
  'PUBLISHED',
  'CLOSED', 
  'ARCHIVED'
];

// Labels para mostrar en la UI
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  TEXT: 'Texto corto',
  TEXTAREA: 'Texto largo',
  open_text: 'Pregunta abierta',
  MULTIPLE_CHOICE: 'Opción múltiple',
  CHECKBOX: 'Casillas de verificación',
  RATING_SCALE: 'Escala de calificación',
  NUMBER: 'Número',
  EMAIL: 'Correo electrónico',
  DATE: 'Fecha',
  TIME: 'Hora',
  BOOLEAN: 'Sí/No',
  WORD_SEARCH: 'Sopa de letras',
  CROSSWORD: 'Crucigrama'
};

export const FORM_STATUS_LABELS: Record<FormStatus, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  CLOSED: 'Cerrado',
  ARCHIVED: 'Archivado'
};