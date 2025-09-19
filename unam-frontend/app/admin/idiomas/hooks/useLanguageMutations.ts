import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageEntity } from '@/types';
import { toast } from 'sonner';
import { 
  validateLanguageForm,
  type CreateLanguageFormData,
  type UpdateLanguageFormData 
} from '@/schemas/language-forms';
import { MUTATION_RESPONSE_FRAGMENT, DELETE_RESPONSE_FRAGMENT } from '@/lib/graphql/fragments';

interface UseLanguageMutationsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseLanguageMutationsReturn {
  createLanguage: (data: CreateLanguageFormData) => Promise<boolean>;
  updateLanguage: (id: string, data: UpdateLanguageFormData) => Promise<boolean>;
  deleteLanguage: (id: string) => Promise<boolean>;
  toggleLanguageStatus: (id: string) => Promise<boolean>;
  loading: boolean;
}

const CREATE_LANGUAGE = `
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation CreateLanguage($createLenguageInput: CreateLenguageInput!) {
    createLenguage(createLenguageInput: $createLenguageInput) {
      ...MutationResponseFields
    }
  }
`;

const UPDATE_LANGUAGE = `
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateLanguage($updateLenguageInput: UpdateLenguageInput!) {
    updateLenguage(updateLenguageInput: $updateLenguageInput) {
      ...MutationResponseFields
    }
  }
`;

const DELETE_LANGUAGE = `
  ${DELETE_RESPONSE_FRAGMENT}
  mutation DeleteLanguage($id: ID!) {
    removeLenguage(id: $id) {
      ...DeleteResponseFields
    }
  }
`;

const TOGGLE_LANGUAGE_STATUS = `
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation ToggleLanguageStatus($id: ID!) {
    toggleLanguageStatus(id: $id) {
      ...MutationResponseFields
    }
  }
`;



const fetchGraphQL = async (query: string, variables: Record<string, any>, token: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'Error en la operación GraphQL');
  }

  return result.data;
};

export function useLanguageMutations({
  onSuccess,
  onError
}: UseLanguageMutationsProps = {}): UseLanguageMutationsReturn {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);



  const createLanguage = useCallback(async (data: CreateLanguageFormData): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const validationResult = validateLanguageForm(data, false);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
        const errorMessage = errors || 'Error de validación';
        toast.error(errorMessage);
        onError?.(errorMessage);
        return false;
      }
      
      const variables = {
        createLenguageInput: validationResult.data
      };

      await fetchGraphQL(CREATE_LANGUAGE, variables, token);
      
      toast.success('Idioma creado exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al crear idioma: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error creating language:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  const updateLanguage = useCallback(async (id: string, data: UpdateLanguageFormData): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const validationResult = validateLanguageForm(data, true);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
        const errorMessage = errors || 'Error de validación';
        toast.error(errorMessage);
        onError?.(errorMessage);
        return false;
      }
      
      const variables = {
        updateLenguageInput: {
          id,
          ...validationResult.data
        }
      };

      await fetchGraphQL(UPDATE_LANGUAGE, variables, token);
      
      toast.success('Idioma actualizado exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al actualizar idioma: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error updating language:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  const deleteLanguage = useCallback(async (id: string): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const variables = { id };
      await fetchGraphQL(DELETE_LANGUAGE, variables, token);
      
      toast.success('Idioma eliminado exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al eliminar idioma: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error deleting language:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  const toggleLanguageStatus = useCallback(async (id: string): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const variables = { id };
      const data = await fetchGraphQL(TOGGLE_LANGUAGE_STATUS, variables, token);
      
      // La mutación devuelve directamente el objeto Language actualizado
      const updatedLanguage = data.toggleLanguageStatus;
      if (updatedLanguage && updatedLanguage.isActive !== undefined) {
        const statusMessage = updatedLanguage.isActive 
          ? 'Idioma activado exitosamente' 
          : 'Idioma desactivado exitosamente';
        toast.success(statusMessage);
        onSuccess?.();
        return true;
      } else {
        const errorMessage = 'No se pudo obtener el estado actualizado del idioma';
        toast.error(errorMessage);
        onError?.(errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cambiar estado del idioma: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error toggling language status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  return {
    createLanguage,
    updateLanguage,
    deleteLanguage,
    toggleLanguageStatus,
    loading
  };
}

export default useLanguageMutations;