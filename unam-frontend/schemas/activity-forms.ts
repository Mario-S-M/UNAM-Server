import { z } from 'zod';
import { FormQuestionSchema } from './form-forms';

// Esquema para crear actividad
export const CreateActivityFormSchema = z.object({
  name: z.string({
    message: 'El nombre es requerido y debe ser un texto'
  }).min(1, 'El nombre no puede estar vacío').max(255, 'El nombre no puede exceder 255 caracteres'),
  
  description: z.string({
    message: 'La descripción es requerida y debe ser un texto'
  }).min(1, 'La descripción no puede estar vacía').max(1000, 'La descripción no puede exceder 1000 caracteres'),
  
  indication: z.string({
    message: 'La indicación es requerida y debe ser un texto'
  }).min(1, 'La indicación no puede estar vacía').max(1000, 'La indicación no puede exceder 1000 caracteres'),
  
  example: z.string({
    message: 'El ejemplo es requerido y debe ser un texto'
  }).min(1, 'El ejemplo no puede estar vacío').max(1000, 'El ejemplo no puede exceder 1000 caracteres'),
  
  contentId: z.string({
    message: 'El ID del contenido es requerido y debe ser un texto'
  }).uuid('El ID del contenido debe ser un UUID válido'),
  
  formId: z.string().uuid('El ID del formulario debe ser un UUID válido').optional(),
  
  questions: z.array(FormQuestionSchema).optional()
});

// Esquema para actualizar actividad
export const UpdateActivityFormSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido'),
  
  name: z.string({
    message: 'El nombre debe ser un texto'
  }).min(1, 'El nombre no puede estar vacío').max(255, 'El nombre no puede exceder 255 caracteres').optional(),
  
  description: z.string({
    message: 'La descripción debe ser un texto'
  }).min(1, 'La descripción no puede estar vacía').max(1000, 'La descripción no puede exceder 1000 caracteres').optional(),
  
  indication: z.string({
    message: 'La indicación debe ser un texto'
  }).min(1, 'La indicación no puede estar vacía').max(1000, 'La indicación no puede exceder 1000 caracteres').optional(),
  
  example: z.string({
    message: 'El ejemplo debe ser un texto'
  }).min(1, 'El ejemplo no puede estar vacío').max(1000, 'El ejemplo no puede exceder 1000 caracteres').optional(),
  
  formId: z.string().uuid('El ID del formulario debe ser un UUID válido').optional(),
  
  questions: z.array(FormQuestionSchema).optional()
});

// Esquema para filtros de actividades
export const ActivityFiltersSchema = z.object({
  search: z.string().optional(),
  contentId: z.string().uuid('El ID del contenido debe ser un UUID válido').optional(),
  page: z.number().int().min(1, 'La página debe ser mayor a 0').optional().default(1),
  limit: z.number().int().min(1, 'El límite debe ser mayor a 0').max(100, 'El límite no puede exceder 100').optional().default(10)
});

// Esquema para validar ID de actividad
export const ActivityIdSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido')
});

// Esquema para buscar actividades por contenido
export const ActivitiesByContentSchema = z.object({
  contentId: z.string({
    message: 'El ID del contenido es requerido y debe ser un texto'
  }).uuid('El ID del contenido debe ser un UUID válido')
});

// Tipos TypeScript derivados de los esquemas
export type CreateActivityFormData = z.infer<typeof CreateActivityFormSchema>;
export type UpdateActivityFormData = z.infer<typeof UpdateActivityFormSchema>;
export type ActivityFiltersData = z.infer<typeof ActivityFiltersSchema>;
export type ActivityIdData = z.infer<typeof ActivityIdSchema>;
export type ActivitiesByContentData = z.infer<typeof ActivitiesByContentSchema>;

// Funciones helper para validación
export const validateActivityForm = (data: unknown, isUpdate = false) => {
  const schema = isUpdate ? UpdateActivityFormSchema : CreateActivityFormSchema;
  return schema.safeParse(data);
};

export const validateActivityFilters = (data: unknown) => {
  return ActivityFiltersSchema.safeParse(data);
};

export const validateActivityId = (data: unknown) => {
  return ActivityIdSchema.safeParse(data);
};

export const validateActivitiesByContent = (data: unknown) => {
  return ActivitiesByContentSchema.safeParse(data);
};

// Función helper para obtener datos de actividad limpios
export const getCleanActivityData = (data: CreateActivityFormData | UpdateActivityFormData) => {
  // Remover campos vacíos o undefined para updates
  if ('id' in data) {
    const cleanData: Partial<UpdateActivityFormData> = { id: data.id };
    if (data.name && data.name.trim()) cleanData.name = data.name.trim();
    if (data.description && data.description.trim()) cleanData.description = data.description.trim();
    if (data.indication && data.indication.trim()) cleanData.indication = data.indication.trim();
    if (data.example && data.example.trim()) cleanData.example = data.example.trim();
    return cleanData;
  }
  
  // Para crear, todos los campos son requeridos
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    indication: data.indication.trim(),
    example: data.example.trim(),
    contentId: data.contentId
  };
};