import { z } from 'zod';

// Enums
export const ValidRolesEnum = z.enum([
  'superUser',
  'admin', 
  'docente',
  'alumno',
  'mortal'
], {
  message: 'Rol inválido'
});

// Esquema para registro de usuario (SignupInput)
export const SignupFormSchema = z.object({
  email: z
    .string({ message: 'El email debe ser una cadena de texto' })
    .email('Formato de email inválido')
    .min(1, 'El email no puede estar vacío')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  fullName: z
    .string({ message: 'El nombre completo debe ser una cadena de texto' })
    .min(1, 'El nombre completo no puede estar vacío')
    .max(100, 'El nombre completo no puede exceder 100 caracteres')
    .trim(),
  
  password: z
    .string({ message: 'La contraseña debe ser una cadena de texto' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede exceder 50 caracteres')
});

// Esquema para login
export const LoginFormSchema = z.object({
  email: z
    .string({ message: 'El email debe ser una cadena de texto' })
    .email('Formato de email inválido')
    .min(1, 'El email no puede estar vacío'),
  
  password: z
    .string({ message: 'La contraseña debe ser una cadena de texto' })
    .min(1, 'La contraseña no puede estar vacía')
});

// Esquema para actualizar usuario (UpdateUserInput)
export const UpdateUserFormSchema = z.object({
  id: z
    .string({ message: 'El ID debe ser una cadena de texto' })
    .uuid('El ID debe ser un UUID válido'),
  
  fullName: z
    .string({ message: 'El nombre completo debe ser una cadena de texto' })
    .min(1, 'El nombre completo no puede estar vacío')
    .max(100, 'El nombre completo no puede exceder 100 caracteres')
    .trim()
    .optional(),
  
  password: z
    .string({ message: 'La contraseña debe ser una cadena de texto' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede exceder 50 caracteres')
    .optional()
});

// Esquema para actualizar roles de usuario (UpdateUserRolesInput)
export const UpdateUserRolesFormSchema = z.object({
  id: z
    .string({ message: 'El ID debe ser una cadena de texto' })
    .uuid('El ID debe ser un UUID válido'),
  
  roles: z
    .array(ValidRolesEnum, { message: 'Los roles deben ser un array' })
    .min(1, 'Debe seleccionar al menos un rol')
    .max(5, 'No puede seleccionar más de 5 roles')
});

// Esquema para asignar idioma a usuario (AssignLanguageInput)
export const AssignLanguageFormSchema = z.object({
  userId: z
    .string({ message: 'El ID del usuario debe ser una cadena de texto' })
    .uuid('El ID del usuario debe ser un UUID válido'),
  
  languageId: z
    .string({ message: 'El ID del idioma debe ser una cadena de texto' })
    .uuid('El ID del idioma debe ser un UUID válido')
    .optional()
});

// Esquema para asignar múltiples idiomas a usuario
export const AssignMultipleLanguagesFormSchema = z.object({
  userId: z
    .string({ message: 'El ID del usuario debe ser una cadena de texto' })
    .uuid('El ID del usuario debe ser un UUID válido'),
  
  languageIds: z
    .array(
      z.string().uuid('Cada ID de idioma debe ser un UUID válido'),
      { message: 'Los IDs de idiomas deben ser un array' }
    )
    .min(1, 'Debe seleccionar al menos un idioma')
    .max(10, 'No puede seleccionar más de 10 idiomas')
});

// Esquema para filtros de usuarios (UsersFilterArgs)
export const UsersFilterSchema = z.object({
  roles: z
    .array(ValidRolesEnum)
    .optional()
    .default([]),
  
  search: z
    .string()
    .min(1, 'El término de búsqueda no puede estar vacío')
    .max(100, 'El término de búsqueda no puede exceder 100 caracteres')
    .trim()
    .optional(),
  
  page: z
    .number({ message: 'La página debe ser un número' })
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0')
    .optional()
    .default(1),
  
  limit: z
    .number({ message: 'El límite debe ser un número' })
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite no puede exceder 100')
    .optional()
    .default(10),
  
  assignedLanguageId: z
    .string()
    .uuid('El ID del idioma asignado debe ser un UUID válido')
    .optional()
});

// Esquema para validar ID de usuario
export const UserIdSchema = z.object({
  id: z
    .string({ message: 'El ID debe ser una cadena de texto' })
    .uuid('El ID debe ser un UUID válido')
});

// Tipos TypeScript derivados de los esquemas
export type SignupFormData = z.infer<typeof SignupFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserFormSchema>;
export type UpdateUserRolesFormData = z.infer<typeof UpdateUserRolesFormSchema>;
export type AssignLanguageFormData = z.infer<typeof AssignLanguageFormSchema>;
export type AssignMultipleLanguagesFormData = z.infer<typeof AssignMultipleLanguagesFormSchema>;
export type UsersFilterData = z.infer<typeof UsersFilterSchema>;
export type UserIdData = z.infer<typeof UserIdSchema>;
export type ValidRoles = z.infer<typeof ValidRolesEnum>;

// Constantes exportadas
export const VALID_ROLES_OPTIONS = [
  { value: 'superUser', label: 'Super Usuario' },
  { value: 'admin', label: 'Administrador' },
  { value: 'docente', label: 'Docente' },
  { value: 'alumno', label: 'Alumno' },
  { value: 'mortal', label: 'Usuario Normal' }
] as const;

// Funciones helper para validación
export const validateSignupForm = (data: unknown) => {
  return SignupFormSchema.safeParse(data);
};

export const validateLoginForm = (data: unknown) => {
  return LoginFormSchema.safeParse(data);
};

export const validateUpdateUserForm = (data: unknown) => {
  return UpdateUserFormSchema.safeParse(data);
};

export const validateUpdateUserRolesForm = (data: unknown) => {
  return UpdateUserRolesFormSchema.safeParse(data);
};

export const validateAssignLanguageForm = (data: unknown) => {
  return AssignLanguageFormSchema.safeParse(data);
};

export const validateAssignMultipleLanguagesForm = (data: unknown) => {
  return AssignMultipleLanguagesFormSchema.safeParse(data);
};

export const validateUsersFilter = (data: unknown) => {
  return UsersFilterSchema.safeParse(data);
};

export const validateUserId = (data: unknown) => {
  return UserIdSchema.safeParse(data);
};

// Función helper para obtener el label de un rol
export const getRoleLabel = (role: ValidRoles): string => {
  const roleOption = VALID_ROLES_OPTIONS.find(option => option.value === role);
  return roleOption?.label || role;
};

// Función helper para validar múltiples roles
export const validateRoles = (roles: string[]): ValidRoles[] => {
  return roles.filter((role): role is ValidRoles => 
    ValidRolesEnum.safeParse(role).success
  );
};