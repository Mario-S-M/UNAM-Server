import { z } from "zod";

export const LenguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  eslogan_atractivo: z.string().optional(),
  descripcion_corta: z.string().optional(),
  descripcion_completa: z.string().optional(),
  nivel: z.string().optional(),
  duracion_total_horas: z.number().optional(),
  color_tema: z.string().optional(),
  icono_curso: z.string().optional(),
  imagen_hero: z.string().optional(),
  badge_destacado: z.string().optional(),

  idioma_origen: z.string().optional(),
  idioma_destino: z.string().optional(),
  certificado_digital: z.boolean().optional(),
  puntuacion_promedio: z.number().optional(),
  total_estudiantes_inscritos: z.number().optional(),
  estado: z.string().optional(),
  featured: z.boolean().optional(),
  fecha_creacion: z.string().optional(),
  fecha_actualizacion: z.string().optional(),
  icons: z.array(z.string()).nullable().default([]),
  isActive: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const LenguagesResponseSchema = z.object({
  data: z.object({
    lenguagesActivate: z.array(LenguageSchema),
  }),
});

export type Lenguage = z.infer<typeof LenguageSchema>;