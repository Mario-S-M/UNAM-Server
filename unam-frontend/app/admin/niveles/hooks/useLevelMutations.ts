'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:50001/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple console log for now - replace with actual toast implementation
  if (type === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
};

// GraphQL fetch function
const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

// GraphQL Mutations
const CREATE_LEVEL = `
  mutation CreateLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      id
      name
      description
      difficulty
      isActive
      lenguageId
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_LEVEL = `
  mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
    updateLevel(updateLevelInput: $updateLevelInput) {
      id
      name
      description
      difficulty
      isActive
      lenguageId
      createdAt
      updatedAt
    }
  }
`;

const DELETE_LEVEL = `
  mutation DeleteLevel($id: ID!) {
    removeLevel(id: $id) {
      id
      name
    }
  }
`;

// Validation schema
const levelSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  difficulty: z.string().min(1, 'La dificultad es requerida'),
  lenguageId: z.string().min(1, 'El idioma es requerido'),
  isActive: z.boolean(),
});

interface LevelFormData {
  name: string;
  description: string;
  difficulty: string;
  lenguageId: string;
  isActive: boolean;
}

interface UseLevelMutationsReturn {
  createLevel: (data: LevelFormData) => Promise<void>;
  updateLevel: (id: string, data: LevelFormData) => Promise<void>;
  deleteLevel: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useLevelMutations(): UseLevelMutationsReturn {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLevel = async (data: LevelFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate data
      const validationResult = levelSchema.safeParse(data);
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => err.message).join(', ');
        throw new Error(`Errores de validación: ${errors}`);
      }
      
      await fetchGraphQL(
        CREATE_LEVEL,
        {
          createLevelInput: validationResult.data,
        },
        token || undefined
      );
      
      showToast('Nivel creado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el nivel';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLevel = async (id: string, data: LevelFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate data
      const validationResult = levelSchema.safeParse(data);
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => err.message).join(', ');
        throw new Error(`Errores de validación: ${errors}`);
      }
      
      const updateData = {
        id,
        ...validationResult.data
      };
      
      await fetchGraphQL(
        UPDATE_LEVEL,
        {
          updateLevelInput: updateData,
        },
        token || undefined
      );
      
      showToast('Nivel actualizado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el nivel';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLevel = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await fetchGraphQL(
        DELETE_LEVEL,
        { id },
        token || undefined
      );
      
      showToast('Nivel eliminado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el nivel';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLevel,
    updateLevel,
    deleteLevel,
    loading,
    error,
  };
}

export type { LevelFormData, UseLevelMutationsReturn };