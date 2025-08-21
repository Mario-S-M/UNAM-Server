'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { GraphQLVariables } from '@/types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

const CREATE_SKILL = `
  mutation CreateSkill($createSkillInput: CreateSkillInput!) {
    createSkill(createSkillInput: $createSkillInput) {
      id
      name
      description
      color
      imageUrl
      icon
      objectives
      prerequisites
      difficulty
      estimatedHours
      tags
      isActive
      levelId
      lenguageId
      level {
        id
        name
        description
        difficulty
      }
      lenguage {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_SKILL = `
  mutation UpdateSkill($updateSkillInput: UpdateSkillInput!) {
    updateSkill(updateSkillInput: $updateSkillInput) {
      id
      name
      description
      color
      imageUrl
      icon
      objectives
      prerequisites
      difficulty
      estimatedHours
      tags
      isActive
      levelId
      lenguageId
      level {
        id
        name
        description
        difficulty
      }
      lenguage {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_SKILL = `
  mutation DeleteSkill($id: ID!) {
    removeSkill(id: $id) {
      id
      name
    }
  }
`;

const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
};

// Schema de validación para skills
const skillSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  color: z.string().min(1, 'El color es requerido'),
  imageUrl: z.string().optional(),
  icon: z.string().optional(),
  objectives: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  difficulty: z.string().min(1, 'La dificultad es requerida'),
  estimatedHours: z.number().min(0, 'Las horas estimadas deben ser positivas').optional(),
  tags: z.array(z.string()).default([]),
  levelId: z.string().min(1, 'El nivel es requerido'),
  lenguageId: z.string().min(1, 'El idioma es requerido'),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// Función helper para manejar errores
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

export interface UseSkillMutationsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface UseSkillMutationsReturn {
  createSkill: (data: SkillFormData) => Promise<void>;
  updateSkill: (id: string, data: SkillFormData) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

export function useSkillMutations({
  onSuccess,
  onError
}: UseSkillMutationsProps = {}): UseSkillMutationsReturn {
  const { token } = useAuth();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSkill = async (data: SkillFormData) => {
    if (!token) {
      const errorMsg = 'No hay token de autenticación';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      
      // Validar datos
      const validatedData = skillSchema.parse(data);
      
      // Preparar datos para GraphQL
      const submitData = {
        ...validatedData,
        objectives: validatedData.objectives.join('\n'),
        prerequisites: validatedData.prerequisites.join('\n'),
        estimatedHours: validatedData.estimatedHours || 0,
      };
      
      await fetchGraphQL(
        CREATE_SKILL,
        { createSkillInput: submitData },
        token
      );
      
      toast.success('Skill creado exitosamente');
      onSuccess?.();
    } catch (err) {
      console.error('Error creating skill:', err);
      let errorMessage = 'Error al crear el skill';
      
      if (err instanceof z.ZodError) {
        errorMessage = err.issues[0]?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const updateSkill = async (id: string, data: SkillFormData) => {
    if (!token) {
      const errorMsg = 'No hay token de autenticación';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      
      // Validar datos
      const validatedData = skillSchema.parse(data);
      
      // Preparar datos para GraphQL
      const submitData = {
        id,
        ...validatedData,
        objectives: validatedData.objectives.join('\n'),
        prerequisites: validatedData.prerequisites.join('\n'),
        estimatedHours: validatedData.estimatedHours || 0,
      };
      
      await fetchGraphQL(
        UPDATE_SKILL,
        { updateSkillInput: submitData },
        token
      );
      
      toast.warning('Skill actualizado exitosamente');
      onSuccess?.();
    } catch (err) {
      console.error('Error updating skill:', err);
      let errorMessage = 'Error al actualizar el skill';
      
      if (err instanceof z.ZodError) {
        errorMessage = err.issues[0]?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!token) {
      const errorMsg = 'No hay token de autenticación';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      
      await fetchGraphQL(
        DELETE_SKILL,
        { id },
        token
      );
      
      toast.error('Skill eliminado exitosamente');
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting skill:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el skill';
      
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createSkill,
    updateSkill,
    deleteSkill,
    isCreating,
    isUpdating,
    isDeleting,
    error
  };
}

export default useSkillMutations;