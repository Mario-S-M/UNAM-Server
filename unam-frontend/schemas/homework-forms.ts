import { z } from 'zod';

// Esquema para crear homework
export const CreateHomeworkFormSchema = z.object({
  name: z.string({
    message: 'El nombre es requerido y debe ser un texto'
  }).min(1, 'El nombre no puede estar vacío').max(255, 'El nombre no puede exceder 255 caracteres'),
  
  description: z.string({
    message: 'La descripción es requerida y debe ser un texto'
  }).min(1, 'La descripción no puede estar vacía').max(2000, 'La descripción no puede exceder 2000 caracteres'),
  
  correctAnswer: z.string({
    message: 'La respuesta correcta es requerida y debe ser un texto'
  }).min(1, 'La respuesta correcta no puede estar vacía').max(1000, 'La respuesta correcta no puede exceder 1000 caracteres'),
  
  activityId: z.string({
    message: 'El ID de la actividad es requerido y debe ser un texto'
  }).uuid('El ID de la actividad debe ser un UUID válido')
});

// Esquema para actualizar homework
export const UpdateHomeworkFormSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido'),
  
  name: z.string({
    message: 'El nombre debe ser un texto'
  }).min(1, 'El nombre no puede estar vacío').max(255, 'El nombre no puede exceder 255 caracteres').optional(),
  
  description: z.string({
    message: 'La descripción debe ser un texto'
  }).min(1, 'La descripción no puede estar vacía').max(2000, 'La descripción no puede exceder 2000 caracteres').optional(),
  
  correctAnswer: z.string({
    message: 'La respuesta correcta debe ser un texto'
  }).min(1, 'La respuesta correcta no puede estar vacía').max(1000, 'La respuesta correcta no puede exceder 1000 caracteres').optional()
});

// Esquema para filtros de homework
export const HomeworkFiltersSchema = z.object({
  search: z.string().optional(),
  activityId: z.string().uuid('El ID de la actividad debe ser un UUID válido').optional(),
  page: z.number().int().min(1, 'La página debe ser mayor a 0').optional().default(1),
  limit: z.number().int().min(1, 'El límite debe ser mayor a 0').max(100, 'El límite no puede exceder 100').optional().default(10)
});

// Esquema para validar ID de homework
export const HomeworkIdSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido')
});

// Esquema para buscar homework por actividad
export const HomeworkByActivitySchema = z.object({
  activityId: z.string({
    message: 'El ID de la actividad es requerido y debe ser un texto'
  }).uuid('El ID de la actividad debe ser un UUID válido')
});

// Esquema para validar respuesta de estudiante
export const StudentAnswerSchema = z.object({
  homeworkId: z.string({
    message: 'El ID del homework es requerido y debe ser un texto'
  }).uuid('El ID del homework debe ser un UUID válido'),
  
  studentAnswer: z.string({
    message: 'La respuesta del estudiante es requerida y debe ser un texto'
  }).min(1, 'La respuesta no puede estar vacía').max(1000, 'La respuesta no puede exceder 1000 caracteres')
});

// Tipos TypeScript derivados de los esquemas
export type CreateHomeworkFormData = z.infer<typeof CreateHomeworkFormSchema>;
export type UpdateHomeworkFormData = z.infer<typeof UpdateHomeworkFormSchema>;
export type HomeworkFiltersData = z.infer<typeof HomeworkFiltersSchema>;
export type HomeworkIdData = z.infer<typeof HomeworkIdSchema>;
export type HomeworkByActivityData = z.infer<typeof HomeworkByActivitySchema>;
export type StudentAnswerData = z.infer<typeof StudentAnswerSchema>;

// Funciones helper para validación
export const validateHomeworkForm = (data: unknown, isUpdate = false) => {
  const schema = isUpdate ? UpdateHomeworkFormSchema : CreateHomeworkFormSchema;
  return schema.safeParse(data);
};

export const validateHomeworkFilters = (data: unknown) => {
  return HomeworkFiltersSchema.safeParse(data);
};

export const validateHomeworkId = (data: unknown) => {
  return HomeworkIdSchema.safeParse(data);
};

export const validateHomeworkByActivity = (data: unknown) => {
  return HomeworkByActivitySchema.safeParse(data);
};

export const validateStudentAnswer = (data: unknown) => {
  return StudentAnswerSchema.safeParse(data);
};

// Función helper para obtener datos de homework limpios
export const getCleanHomeworkData = (data: CreateHomeworkFormData | UpdateHomeworkFormData) => {
  // Remover campos vacíos o undefined para updates
  if ('id' in data) {
    const cleanData: Partial<UpdateHomeworkFormData> = { id: data.id };
    if (data.name && data.name.trim()) cleanData.name = data.name.trim();
    if (data.description && data.description.trim()) cleanData.description = data.description.trim();
    if (data.correctAnswer && data.correctAnswer.trim()) cleanData.correctAnswer = data.correctAnswer.trim();
    return cleanData;
  }
  
  // Para crear, todos los campos son requeridos
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    correctAnswer: data.correctAnswer.trim(),
    activityId: data.activityId
  };
};

// Función helper para verificar respuesta
export const checkAnswer = (studentAnswer: string, correctAnswer: string): boolean => {
  return studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};