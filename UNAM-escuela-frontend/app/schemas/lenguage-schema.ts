import { z } from "zod";

export const lenguageFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  isActive: z.boolean().optional(),
});

export const lenguageResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
});

export const lenguagesResponseSchema = z.object({
  data: z.array(lenguageResponseSchema),
});

export const graphqlLenguagesResponseSchema = z.object({
  data: z.object({
    lenguages: z.array(lenguageResponseSchema),
  }),
});

export type LenguageFormData = z.infer<typeof lenguageFormSchema>;
export type LenguageResponse = z.infer<typeof lenguageResponseSchema>;
export type GraphqlLenguagesResponse = z.infer<
  typeof graphqlLenguagesResponseSchema
>;
