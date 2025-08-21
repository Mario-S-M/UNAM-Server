import { z } from 'zod';

// Esquema para crear skill
export const CreateSkillFormSchema = z.object({
  name: z.string({
    message: 'El nombre es requerido y debe ser un texto'
  }).min(1, 'El nombre no puede estar vacío').max(100, 'El nombre no puede exceder 100 caracteres'),
  
  description: z.string({
    message: 'La descripción es requerida y debe ser un texto'
  }).min(1, 'La descripción no puede estar vacía').max(500, 'La descripción no puede exceder 500 caracteres'),
  
  color: z.string({
    message: 'El color debe ser un texto válido'
  }).optional().refine((val) => !val || val === '' || /^#[0-9A-Fa-f]{6}$/.test(val), {
    message: 'El color debe ser un código hexadecimal válido (ej: #FF0000) o estar vacío'
  }),

  imageUrl: z.string({
    message: 'La URL de la imagen debe ser un texto válido'
  }).url('La URL de la imagen debe ser válida').optional().or(z.literal('')),

  icon: z.string({
    message: 'El icono debe ser un texto válido'
  }).max(50, 'El nombre del icono no puede exceder 50 caracteres').optional().or(z.literal('')),

  objectives: z.array(z.string().min(1, 'Los objetivos no pueden estar vacíos')).optional(),

  prerequisites: z.array(z.string().min(1, 'Los prerrequisitos no pueden estar vacíos')).optional(),

  difficulty: z.enum(['Básico', 'Intermedio', 'Avanzado'], {
    message: 'La dificultad debe ser: Básico, Intermedio o Avanzado'
  }).optional(),

  estimatedHours: z.number({
    message: 'Las horas estimadas deben ser un número'
  }).int('Las horas estimadas deben ser un número entero').min(1, 'Las horas estimadas deben ser al menos 1').max(1000, 'Las horas estimadas no pueden exceder 1000').optional(),



  levelId: z.string({
    message: 'El nivel debe ser un texto válido'
  }).uuid('El ID del nivel debe ser un UUID válido').optional()
});

// Esquema para actualizar skill
export const UpdateSkillFormSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido'),
  
  name: z.string({
    message: 'El nombre debe ser un texto'
  }).max(100, 'El nombre no puede exceder 100 caracteres').optional().or(z.literal('')),
  
  description: z.string({
    message: 'La descripción debe ser un texto'
  }).max(500, 'La descripción no puede exceder 500 caracteres').optional().or(z.literal('')),
  
  color: z.string({
    message: 'El color debe ser un texto válido'
  }).optional().refine((val) => !val || val === '' || /^#[0-9A-Fa-f]{6}$/.test(val), {
    message: 'El color debe ser un código hexadecimal válido (ej: #FF0000) o estar vacío'
  }),

  imageUrl: z.string({
    message: 'La URL de la imagen debe ser un texto válido'
  }).url('La URL de la imagen debe ser válida').optional().or(z.literal('')),

  icon: z.string({
    message: 'El icono debe ser un texto válido'
  }).max(50, 'El nombre del icono no puede exceder 50 caracteres').optional(),

  objectives: z.array(z.string().min(1, 'Los objetivos no pueden estar vacíos')).optional(),

  prerequisites: z.array(z.string().min(1, 'Los prerrequisitos no pueden estar vacíos')).optional(),

  difficulty: z.enum(['Básico', 'Intermedio', 'Avanzado'], {
    message: 'La dificultad debe ser: Básico, Intermedio o Avanzado'
  }).optional(),

  estimatedHours: z.number({
    message: 'Las horas estimadas deben ser un número'
  }).int('Las horas estimadas deben ser un número entero').min(1, 'Las horas estimadas deben ser al menos 1').max(1000, 'Las horas estimadas no pueden exceder 1000').optional(),



  levelId: z.string({
    message: 'El nivel debe ser un texto válido'
  }).uuid('El ID del nivel debe ser un UUID válido').optional()
});

// Esquema para filtros de skills
export const SkillFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  levelId: z.string().uuid('El ID del nivel debe ser un UUID válido').optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
});

// Esquema para validar ID de skill
export const SkillIdSchema = z.object({
  id: z.string({
    message: 'El ID es requerido y debe ser un texto'
  }).uuid('El ID debe ser un UUID válido')
});

// Tipos TypeScript derivados de los esquemas
export type CreateSkillFormData = z.infer<typeof CreateSkillFormSchema>;
export type UpdateSkillFormData = z.infer<typeof UpdateSkillFormSchema>;
export type SkillFiltersData = z.infer<typeof SkillFiltersSchema>;
export type SkillIdData = z.infer<typeof SkillIdSchema>;

// Función helper para validar formularios de skill
export function validateSkillForm(data: unknown, isUpdate: boolean = false) {
  const schema = isUpdate ? UpdateSkillFormSchema : CreateSkillFormSchema;
  return schema.safeParse(data);
}

// Función helper para limpiar datos del formulario
export function cleanSkillFormData(data: CreateSkillFormData | UpdateSkillFormData): CreateSkillFormData | UpdateSkillFormData {
  const cleaned = { ...data };
  
  // Limpiar espacios en blanco
  if (cleaned.name) {
    cleaned.name = cleaned.name.trim();
  }
  if (cleaned.description) {
    cleaned.description = cleaned.description.trim();
  }
  if (cleaned.color) {
    cleaned.color = cleaned.color.trim().toUpperCase();
  }
  
  // Limpiar y filtrar arrays de objectives y prerequisites
  if (cleaned.objectives) {
    cleaned.objectives = cleaned.objectives
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0);
    if (cleaned.objectives.length === 0) {
      cleaned.objectives = undefined;
    }
  }
  
  if (cleaned.prerequisites) {
    cleaned.prerequisites = cleaned.prerequisites
      .map(prereq => prereq.trim())
      .filter(prereq => prereq.length > 0);
    if (cleaned.prerequisites.length === 0) {
      cleaned.prerequisites = undefined;
    }
  }
  
  // Manejar levelId especial: convertir "none" a undefined
  if (cleaned.levelId === "none") {
    cleaned.levelId = undefined;
  }
  
  return cleaned;
}

// Función helper para validar ID de skill
export function validateSkillId(id: unknown) {
  return SkillIdSchema.safeParse({ id });
}

// Función helper para validar filtros de skills
export function validateSkillFilters(filters: unknown) {
  return SkillFiltersSchema.safeParse(filters);
}