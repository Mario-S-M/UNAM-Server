import { z } from "zod";

export const levelFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede tener más de 500 caracteres"),
});

export const levelResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const levelsResponseSchema = z.object({
  data: z.array(levelResponseSchema),
});

export type LevelFormData = z.infer<typeof levelFormSchema>;
export type LevelResponse = z.infer<typeof levelResponseSchema>;