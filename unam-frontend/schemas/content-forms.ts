import { z } from 'zod';

// Esquema para crear contenido
export const CreateContentFormSchema = z.object({
  name: z.string({
    message: 'El nombre es requerido y debe ser un texto'
  }).min(1, 'El nombre no puede estar vacío').max(200, 'El nombre no puede exceder 200 caracteres'),
  
  description: z.string({
    message: 'La descripción es requerida y debe ser un texto'
  }).min(1, 'La descripción no puede estar vacía').max(1000, 'La descripción no puede exceder 1000 caracteres'),
  
  levelId: z.string({
    message: 'El ID del nivel es requerido y debe ser un texto'
  }).uuid('El ID del nivel debe ser un UUID válido'),
  
  skillId: z.string({
    message: 'El ID de la habilidad es requerido y debe ser un texto'
  }).uuid('El ID de la habilidad debe ser un UUID válido'),
  
  teacherIds: z.array(z.string().uuid('Cada ID de profesor debe ser un UUID válido')).min(1, 'Debe asignar al menos un profesor'),
  
  validationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
    message: 'El estado de validación debe ser PENDING, APPROVED o REJECTED'
  })
});

// Esquema para actualizar contenido
export const UpdateContentFormSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido'),
  
  name: z.string({
    message: 'El nombre debe ser un texto'
  }).max(200, 'El nombre no puede exceder 200 caracteres').optional().or(z.literal('')),
  
  description: z.string({
    message: 'La descripción debe ser un texto'
  }).max(1000, 'La descripción no puede exceder 1000 caracteres').optional().or(z.literal('')),
  
  levelId: z.string({
    message: 'El ID del nivel debe ser un texto'
  }).uuid('El ID del nivel debe ser un UUID válido').optional(),
  
  skillId: z.string({
    message: 'El ID de la habilidad debe ser un texto'
  }).uuid('El ID de la habilidad debe ser un UUID válido').optional(),
  
  teacherIds: z.array(z.string().uuid('Cada ID de profesor debe ser un UUID válido')).min(1, 'Debe asignar al menos un profesor').optional(),
  
  validationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
    message: 'El estado de validación debe ser PENDING, APPROVED o REJECTED'
  }).optional()
});

// Esquema para filtros de contenido
export const ContentFiltersSchema = z.object({
  search: z.string().optional(),
  validationStatus: z.enum(['all', 'PENDING', 'APPROVED', 'REJECTED']).optional(),
  levelId: z.string().uuid().optional(),
  skillId: z.string().uuid().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
});

// Esquema para validar ID de contenido
export const ContentIdSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido')
});

// Esquema para buscar contenido por nivel
export const ContentByLevelSchema = z.object({
  levelId: z.string({
    message: 'El ID del nivel es requerido y debe ser un texto'
  }).uuid('El ID del nivel debe ser un UUID válido')
});

// Esquema para buscar contenido por habilidad
export const ContentBySkillSchema = z.object({
  skillId: z.string({
    message: 'El ID de la habilidad es requerido y debe ser un texto'
  }).uuid('El ID de la habilidad debe ser un UUID válido')
});

// Tipos TypeScript derivados de los esquemas
export type CreateContentFormData = z.infer<typeof CreateContentFormSchema>;
export type UpdateContentFormData = z.infer<typeof UpdateContentFormSchema>;
export type ContentFiltersData = z.infer<typeof ContentFiltersSchema>;
export type ContentIdData = z.infer<typeof ContentIdSchema>;
export type ContentByLevelData = z.infer<typeof ContentByLevelSchema>;
export type ContentBySkillData = z.infer<typeof ContentBySkillSchema>;

// Función helper para validar formularios de contenido
export function validateContentForm(data: unknown, isUpdate: boolean = false) {
  const schema = isUpdate ? UpdateContentFormSchema : CreateContentFormSchema;
  return schema.safeParse(data);
}

// Función helper para limpiar datos del formulario
export function cleanContentFormData(data: CreateContentFormData | UpdateContentFormData): CreateContentFormData | UpdateContentFormData {
  const cleaned = { ...data };
  
  // Limpiar espacios en blanco
  if (cleaned.name) {
    cleaned.name = cleaned.name.trim();
  }
  if (cleaned.description) {
    cleaned.description = cleaned.description.trim();
  }
  
  return cleaned;
}

// Función helper para validar ID de contenido
export function validateContentId(id: unknown) {
  return ContentIdSchema.safeParse({ id });
}

// Función helper para validar filtros de contenido
export function validateContentFilters(filters: unknown) {
  return ContentFiltersSchema.safeParse(filters);
}

// Función helper para validar búsqueda por nivel
export function validateContentByLevel(levelId: unknown) {
  return ContentByLevelSchema.safeParse({ levelId });
}

// Función helper para validar búsqueda por habilidad
export function validateContentBySkill(skillId: unknown) {
  return ContentBySkillSchema.safeParse({ skillId });
}