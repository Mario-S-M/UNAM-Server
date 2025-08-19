import { z } from "zod";

// Schema para Teacher
export const TeacherSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  isActive: z.boolean(),
});

// Schema para Skill
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema para Content
export const ContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  levelId: z.string(),
  userId: z.number(),
  markdownPath: z.string().optional(),
  assignedTeachers: z.array(TeacherSchema),
  validationStatus: z.string(),
  publishedAt: z.string().optional(),
  skill: SkillSchema.optional(),
  skillId: z.string().optional(),
});

// Schema para Level
export const LevelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isCompleted: z.boolean(),
  percentaje: z.number(),
  qualification: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.number(),
  isActive: z.boolean(),
  difficulty: z.string(),
  lenguageId: z.string(),
});

// Schema para Language
export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  icons: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
});

// Schemas para respuestas paginadas
export const PaginatedContentsSchema = z.object({
  contents: z.array(ContentSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const PaginatedSkillsSchema = z.object({
  skills: z.array(SkillSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

// Schemas para respuestas de GraphQL
export const LanguagesResponseSchema = z.object({
  data: z.object({
    lenguagesActivate: z.array(LanguageSchema),
  }),
});

export const SkillsResponseSchema = z.object({
  data: z.object({
    skillsActivePublic: z.array(SkillSchema),
  }),
});

export const LevelsResponseSchema = z.object({
  data: z.object({
    levelsByLenguage: z.array(LevelSchema),
  }),
});

export const ContentsResponseSchema = z.object({
  data: z.object({
    contentsByLevelPublic: z.array(ContentSchema),
  }),
});

export const ContentsBySkillResponseSchema = z.object({
  data: z.object({
    contentsBySkillPublic: z.array(ContentSchema),
  }),
});

export const ContentsByLevelAndSkillResponseSchema = z.object({
  data: z.object({
    contentsByLevelAndSkillPublic: z.array(ContentSchema),
  }),
});

// Tipos inferidos
export type Teacher = z.infer<typeof TeacherSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type Level = z.infer<typeof LevelSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type PaginatedContents = z.infer<typeof PaginatedContentsSchema>;
export type PaginatedSkills = z.infer<typeof PaginatedSkillsSchema>;