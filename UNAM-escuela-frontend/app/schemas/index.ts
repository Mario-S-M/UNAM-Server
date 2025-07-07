import { z } from "zod";

// Esquemas de autenticación
export const loginFormSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerFormSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    roles: z.array(z.string()),
    isActive: z.boolean(),
  }),
});

// Esquema base para idioma asignado (solo campos necesarios)
export const AssignedLanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
});

// Esquema para usuario autenticado (solo campos esenciales)
export const AuthenticatedUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  isActive: z.boolean(),
  assignedLanguageId: z.string().nullable().optional(),
  assignedLanguage: AssignedLanguageSchema.nullable().optional(),
});

// Esquema para usuario en listas (solo campos de visualización)
export const UserListSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  isActive: z.boolean(),
});

// Esquema para contenido básico (solo campos esenciales)
export const BasicContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  isActive: z.boolean(),
  levelId: z.string(),
  skillId: z.string(),
});

// Esquema para contenido completo (con descripción para páginas de detalle)
export const FullContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
  isActive: z.boolean(),
  levelId: z.string(),
  skillId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedTeachers: z
    .array(
      z.object({
        id: z.string(),
        fullName: z.string(),
        email: z.string(),
        roles: z.array(z.string()),
      })
    )
    .optional(),
});

// Esquema para nivel básico
export const BasicLevelSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  languageId: z.string(),
});

// Esquema para nivel completo
export const FullLevelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  languageId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Esquema para habilidad básica
export const BasicSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
});

// Esquema para habilidad completa
export const FullSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Esquema para idioma básico
export const BasicLanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
});

// Esquema para idioma completo
export const FullLanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Tipos TypeScript derivados de los esquemas
export type LoginForm = z.infer<typeof loginFormSchema>;
export type RegisterForm = z.infer<typeof registerFormSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type BasicContent = z.infer<typeof BasicContentSchema>;
export type FullContent = z.infer<typeof FullContentSchema>;
export type BasicLevel = z.infer<typeof BasicLevelSchema>;
export type FullLevel = z.infer<typeof FullLevelSchema>;
export type BasicSkill = z.infer<typeof BasicSkillSchema>;
export type FullSkill = z.infer<typeof FullSkillSchema>;
export type BasicLanguage = z.infer<typeof BasicLanguageSchema>;
export type FullLanguage = z.infer<typeof FullLanguageSchema>;
export type AssignedLanguage = z.infer<typeof AssignedLanguageSchema>;
