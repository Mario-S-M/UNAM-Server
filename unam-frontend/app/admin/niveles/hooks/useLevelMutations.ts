'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  validateLevelForm,
  type CreateLevelFormData,
  type UpdateLevelFormData 
} from '@/schemas/level-forms';
import { 
  LEVEL_MUTATION_RESPONSE_FRAGMENT,
  LEVEL_DELETE_RESPONSE_FRAGMENT 
} from '@/lib/graphql/fragments';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Helper function for error handling
const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
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
  ${LEVEL_MUTATION_RESPONSE_FRAGMENT}
  
  mutation CreateLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      ...LevelMutationResponseFields
    }
  }
`;

const UPDATE_LEVEL = `
  ${LEVEL_MUTATION_RESPONSE_FRAGMENT}
  
  mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
    updateLevel(updateLevelInput: $updateLevelInput) {
      ...LevelMutationResponseFields
    }
  }
`;

const DELETE_LEVEL = `
  ${LEVEL_DELETE_RESPONSE_FRAGMENT}
  
  mutation DeleteLevel($id: ID!) {
    removeLevel(id: $id) {
      ...LevelDeleteResponseFields
    }
  }
`;

const TOGGLE_LEVEL_STATUS = `
  ${LEVEL_MUTATION_RESPONSE_FRAGMENT}
  
  mutation ToggleLevelStatus($id: ID!) {
    toggleLevelStatus(id: $id) {
      ...LevelMutationResponseFields
    }
  }
`;



interface UseLevelMutationsReturn {
  createLevel: (data: CreateLevelFormData) => Promise<void>;
  updateLevel: (id: string, data: UpdateLevelFormData) => Promise<void>;
  deleteLevel: (id: string) => Promise<void>;
  toggleLevelStatus: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useLevelMutations(): UseLevelMutationsReturn {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLevel = async (data: CreateLevelFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate data
      const validationResult = validateLevelForm(data, false);
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
      
      toast.success('Nivel creado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el nivel';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLevel = async (id: string, data: UpdateLevelFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate data
      const validationResult = validateLevelForm(data, true);
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
      
      toast.success('Nivel actualizado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el nivel';
      setError(errorMessage);
      toast.error(errorMessage);
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
      
      toast.success('Nivel eliminado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el nivel';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLevelStatus = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchGraphQL(
        TOGGLE_LEVEL_STATUS,
        { id },
        token || undefined
      );
      
      console.log('Full response:', JSON.stringify(data, null, 2)); // Debug log
      
      // Acceder directamente a los datos de la mutación
      const level = data?.toggleLevelStatus;
      console.log('Level from toggleLevelStatus:', level); // Debug log
      
      if (level?.isActive !== undefined) {
        const statusMessage = level.isActive ? 'Nivel activado con éxito' : 'Nivel desactivado con éxito';
        console.log('Status message:', statusMessage); // Debug log
        toast.success(statusMessage);
      } else {
        console.error('No se pudo obtener el estado del nivel:', level);
        toast.error('Error al cambiar el estado del nivel');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar el estado del nivel';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLevel,
    updateLevel,
    deleteLevel,
    toggleLevelStatus,
    loading,
    error,
  };
}

export type { UseLevelMutationsReturn };