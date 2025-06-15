import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "El nombre es requerido")
    .email("El email no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
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
export type LoginResponse = z.infer<typeof loginResponseSchema>;
