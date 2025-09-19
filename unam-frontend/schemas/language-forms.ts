import { z } from "zod";

// Enums basados en el backend
const NIVEL_OPTIONS = [
  'Básico',
  'Básico-Intermedio',
  'Intermedio',
  'Intermedio-Avanzado',
  'Avanzado'
] as const;

const BADGE_OPTIONS = [
  'Más Popular',
  'Nuevo',
  'Recomendado'
] as const;

const ESTADO_OPTIONS = [
  'Activo',
  'Inactivo',
  'En Desarrollo',
  'Pausado'
] as const;

// Schema para crear un nuevo idioma
export const CreateLanguageFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  
  eslogan_atractivo: z
    .string()
    .max(200, "El eslogan no puede exceder 200 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  descripcion_corta: z
    .string()
    .max(100, "La descripción corta no puede exceder 100 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  descripcion_completa: z
    .string()
    .max(1000, "La descripción completa no puede exceder 1000 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),
  
  nivel: z
    .enum(NIVEL_OPTIONS, {
      message: "Selecciona un nivel válido"
    })
    .optional(),
  
  color_tema: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || /^#[0-9A-Fa-f]{6}$/.test(val), {
      message: "Debe ser un código de color hexadecimal válido o estar vacío"
    }),
  
  icono_curso: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: "Debe ser una URL válida o estar vacío"
    }),

  imagen_hero: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: "Debe ser una URL válida o estar vacío"
    }),
  
  badge_destacado: z
    .enum(BADGE_OPTIONS, {
      message: "Selecciona un badge válido"
    })
    .optional(),
  
  idioma_origen: z
    .string()
    .max(50, "El idioma origen no puede exceder 50 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  idioma_destino: z
    .string()
    .max(50, "El idioma destino no puede exceder 50 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),
  
  certificado_digital: z
    .boolean()
    .default(false),
  
  puntuacion_promedio: z
    .number()
    .min(0, "La puntuación debe ser mayor o igual a 0")
    .max(5, "La puntuación debe ser menor o igual a 5")
    .multipleOf(0.01, "La puntuación puede tener máximo 2 decimales")
    .default(0),
  
  total_estudiantes_inscritos: z
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo")
    .default(0),
  
  estado: z
    .enum(ESTADO_OPTIONS, {
      message: "Selecciona un estado válido"
    })
    .default('Activo'),
  
  featured: z
    .boolean()
    .default(false),
  
  icons: z
    .array(z.string().min(1, "Los iconos no pueden estar vacíos"))
    .max(10, "No puedes tener más de 10 iconos")
    .optional(),
  
  isActive: z
    .boolean()
    .default(true)
});

// Schema para actualizar un idioma existente
export const UpdateLanguageFormSchema = z.object({
  id: z
    .string()
    .min(1, "ID es requerido")
    .uuid("ID inválido"),
  
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
    .optional(),
  
  eslogan_atractivo: z
    .string()
    .max(200, "El eslogan no puede exceder 200 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  descripcion_corta: z
    .string()
    .max(100, "La descripción corta no puede exceder 100 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  descripcion_completa: z
    .string()
    .max(1000, "La descripción completa no puede exceder 1000 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),
  
  nivel: z
    .enum(NIVEL_OPTIONS, {
      message: "Selecciona un nivel válido"
    })
    .optional(),
  
  color_tema: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || /^#[0-9A-Fa-f]{6}$/.test(val), {
      message: "Debe ser un código de color hexadecimal válido o estar vacío"
    }),
  
  icono_curso: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: "Debe ser una URL válida o estar vacío"
    }),

  imagen_hero: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: "Debe ser una URL válida o estar vacío"
    }),
  
  badge_destacado: z
    .enum(BADGE_OPTIONS, {
      message: "Selecciona un badge válido"
    })
    .optional(),
  
  idioma_origen: z
    .string()
    .max(50, "El idioma origen no puede exceder 50 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),

  idioma_destino: z
    .string()
    .max(50, "El idioma destino no puede exceder 50 caracteres")
    .trim()
    .optional()
    .or(z.literal('')),
  
  certificado_digital: z
    .boolean()
    .optional(),
  
  puntuacion_promedio: z
    .number()
    .min(0, "La puntuación debe ser mayor o igual a 0")
    .max(5, "La puntuación debe ser menor o igual a 5")
    .multipleOf(0.01, "La puntuación puede tener máximo 2 decimales")
    .optional(),
  
  total_estudiantes_inscritos: z
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo")
    .optional(),
  
  estado: z
    .enum(ESTADO_OPTIONS, {
      message: "Selecciona un estado válido"
    })
    .optional(),
  
  featured: z
    .boolean()
    .optional(),
  
  icons: z
    .array(z.string().min(1, "Los iconos no pueden estar vacíos"))
    .max(10, "No puedes tener más de 10 iconos")
    .optional(),
  
  isActive: z
    .boolean()
    .optional()
});

// Schema para filtros de búsqueda de idiomas
export const LanguageFiltersSchema = z.object({
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
    .optional()
});

// Schema para validar ID de idioma
export const LanguageIdSchema = z.object({
  id: z
    .string()
    .min(1, "ID es requerido")
    .uuid("ID de idioma inválido")
});

// Tipos TypeScript derivados de los esquemas
export type CreateLanguageFormData = z.infer<typeof CreateLanguageFormSchema>;
export type UpdateLanguageFormData = z.infer<typeof UpdateLanguageFormSchema>;
export type LanguageFiltersData = z.infer<typeof LanguageFiltersSchema>;
export type LanguageIdData = z.infer<typeof LanguageIdSchema>;

// Constantes exportadas
export { NIVEL_OPTIONS, BADGE_OPTIONS, ESTADO_OPTIONS };

// Función helper para validar formularios de idioma
export const validateLanguageForm = (data: unknown, isUpdate = false) => {
  const schema = isUpdate ? UpdateLanguageFormSchema : CreateLanguageFormSchema;
  return schema.safeParse(data);
};

// Función helper para validar filtros
export const validateLanguageFilters = (data: unknown) => {
  return LanguageFiltersSchema.safeParse(data);
};

// Función helper para validar ID
export const validateLanguageId = (data: unknown) => {
  return LanguageIdSchema.safeParse(data);
};

// Función helper para validar array de iconos desde string
export const parseIconsFromString = (iconsString: string): string[] => {
  if (!iconsString.trim()) return [];
  return iconsString
    .split(',')
    .map(icon => icon.trim())
    .filter(icon => icon.length > 0);
};

// Función helper para convertir array de iconos a string
export const iconsToString = (icons: string[]): string => {
  return icons.join(', ');
};