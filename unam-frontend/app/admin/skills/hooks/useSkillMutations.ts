'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GraphQLVariables } from '@/types';
import { 
  validateSkillForm,
  cleanSkillFormData,
  type CreateSkillFormData,
  type UpdateSkillFormData 
} from '@/schemas/skill-forms';

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



// Función helper para manejar errores
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

export interface UseSkillMutationsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface UseSkillMutationsReturn {
  createSkill: (data: CreateSkillFormData) => Promise<void>;
  updateSkill: (id: string, data: UpdateSkillFormData) => Promise<void>;
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

  const createSkill = async (data: CreateSkillFormData) => {
    if (!token) {
      const errorMsg = 'No hay token de autenticación';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      
      // Limpiar y validar datos
      const cleanedData = cleanSkillFormData(data);
      const validationResult = validateSkillForm(cleanedData, false);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
        const errorMessage = errors || 'Error de validación';
        setError(errorMessage);
        onError?.(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      await fetchGraphQL(
        CREATE_SKILL,
        { createSkillInput: validationResult.data },
        token
      );
      
      toast.success('Skill creado exitosamente');
      onSuccess?.();
    } catch (err) {
      console.error('Error creating skill:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el skill';
      
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const updateSkill = async (id: string, data: UpdateSkillFormData) => {
    if (!token) {
      const errorMsg = 'No hay token de autenticación';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      
      // Limpiar y validar datos
      const cleanedData = cleanSkillFormData(data);
      const validationResult = validateSkillForm(cleanedData, true);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
        const errorMessage = errors || 'Error de validación';
        setError(errorMessage);
        onError?.(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      const submitData = {
        id,
        ...validationResult.data
      };
      
      await fetchGraphQL(
        UPDATE_SKILL,
        { updateSkillInput: submitData },
        token
      );
      
      toast.success('Skill actualizado exitosamente');
      onSuccess?.();
    } catch (err) {
      console.error('Error updating skill:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el skill';
      
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