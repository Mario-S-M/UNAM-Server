import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "El nombre es requerido")
    .email("El email no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const registerFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El email no es válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede tener más de 50 caracteres"),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    roles: z.array(z.string()),
    isActive: z.boolean(),
  }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
