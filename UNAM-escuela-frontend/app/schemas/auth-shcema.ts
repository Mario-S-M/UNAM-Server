import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "El nombre es requerido")
    .email("El email no es válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
});

export const loginResponseSchema = z.object({
  token: z.string()
});


export type LoginFormData = z.infer<typeof loginFormSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
