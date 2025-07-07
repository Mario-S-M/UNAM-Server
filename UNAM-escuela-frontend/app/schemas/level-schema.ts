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
  difficulty: z
    .enum([
      "beginner",
      "mid-intermediate",
      "intermediate",
      "upper-intermediate",
      "advanced",
    ])
    .optional()
    .default("beginner"),
  lenguageId: z.string().min(1, "El idioma es requerido"),
});

export const levelResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  difficulty: z
    .enum([
      "beginner",
      "mid-intermediate",
      "intermediate",
      "upper-intermediate",
      "advanced",
    ])
    .optional(),
  isActive: z.boolean().optional(),
});

export const levelsResponseSchema = z.object({
  data: z.array(levelResponseSchema),
});

export const graphqlLevelsResponseSchema = z.object({
  data: z.object({
    levelsByLenguage: z.array(levelResponseSchema),
  }),
});

export type LevelFormData = z.infer<typeof levelFormSchema>;
export type LevelResponse = z.infer<typeof levelResponseSchema>;
export type GraphqlLevelsResponse = z.infer<typeof graphqlLevelsResponseSchema>;
