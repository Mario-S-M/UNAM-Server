import { z } from "zod";

// Constantes para validación
const DIFFICULTY_OPTIONS = [
  'Básico',
  'Básico-Intermedio', 
  'Intermedio',
  'Intermedio-Avanzado',
  'Avanzado'
] as const;

// Schema para crear un nuevo nivel
export const CreateLevelFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim(),
  
  difficulty: z
    .enum(DIFFICULTY_OPTIONS, {
      message: "Selecciona una dificultad válida"
    })
    .default('Básico'),
  
  lenguageId: z
    .string()
    .min(1, "Debes seleccionar un idioma")
    .uuid("ID de idioma inválido"),
  
  isActive: z
    .boolean()
    .default(true)
});

// Schema para actualizar un nivel existente
export const UpdateLevelFormSchema = z.object({
  id: z
    .string()
    .min(1, "ID es requerido")
    .uuid("ID inválido"),
  
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),
  
  difficulty: z
    .enum(DIFFICULTY_OPTIONS, {
      message: "Selecciona una dificultad válida"
    })
    .optional(),
  
  lenguageId: z
    .string()
    .uuid("ID de idioma inválido")
    .optional(),
  
  isActive: z
    .boolean()
    .optional()
});

// Schema para filtros de búsqueda de niveles
export const LevelFiltersSchema = z.object({
  search: z
    .string()
    .max(100, "La búsqueda no puede exceder 100 caracteres")
    .optional(),
  
  page: z
    .number()
    .int("La página debe ser un número entero")
    .min(1, "La página debe ser mayor a 0")
    .default(1),
  
  limit: z
    .number()
    .int("El límite debe ser un número entero")
    .min(1, "El límite debe ser mayor a 0")
    .max(100, "El límite no puede exceder 100")
    .default(10),
  
  isActive: z
    .boolean()
    .optional(),
  
  lenguageId: z
    .string()
    .uuid("ID de idioma inválido")
    .optional(),
  
  difficulty: z
    .enum(DIFFICULTY_OPTIONS)
    .optional()
});

// Schema para validar ID de nivel
export const LevelIdSchema = z.object({
  id: z
    .string()
    .min(1, "ID es requerido")
    .uuid("ID de nivel inválido")
});

// Tipos TypeScript derivados de los esquemas
export type CreateLevelFormData = z.infer<typeof CreateLevelFormSchema>;
export type UpdateLevelFormData = z.infer<typeof UpdateLevelFormSchema>;
export type LevelFiltersData = z.infer<typeof LevelFiltersSchema>;
export type LevelIdData = z.infer<typeof LevelIdSchema>;

// Constantes exportadas
export { DIFFICULTY_OPTIONS };

// Función helper para validar formularios de nivel
export const validateLevelForm = (data: unknown, isUpdate = false) => {
  const schema = isUpdate ? UpdateLevelFormSchema : CreateLevelFormSchema;
  return schema.safeParse(data);
};

// Función helper para validar filtros
export const validateLevelFilters = (data: unknown) => {
  return LevelFiltersSchema.safeParse(data);
};

// Función helper para validar ID
export const validateLevelId = (data: unknown) => {
  return LevelIdSchema.safeParse(data);
};