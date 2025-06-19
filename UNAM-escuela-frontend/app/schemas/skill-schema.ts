import { z } from "zod";

export const skillFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede tener más de 500 caracteres"),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Color debe ser un valor hexadecimal válido"
    )
    .optional()
    .default("#3B82F6"),
});

export const skillResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const skillsResponseSchema = z.object({
  data: z.array(skillResponseSchema),
});

export const graphqlSkillsResponseSchema = z.object({
  data: z.object({
    skills: z.array(skillResponseSchema),
  }),
});

export const graphqlActiveSkillsResponseSchema = z.object({
  data: z.object({
    skillsActive: z.array(skillResponseSchema),
  }),
});

export const graphqlSingleSkillResponseSchema = z.object({
  data: z.object({
    skill: skillResponseSchema,
  }),
});

export type SkillFormData = z.infer<typeof skillFormSchema>;
export type SkillResponse = z.infer<typeof skillResponseSchema>;
export type SkillsResponse = z.infer<typeof skillsResponseSchema>;
export type GraphqlSkillsResponse = z.infer<typeof graphqlSkillsResponseSchema>;
export type GraphqlActiveSkillsResponse = z.infer<
  typeof graphqlActiveSkillsResponseSchema
>;
