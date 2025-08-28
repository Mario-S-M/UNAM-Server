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
  loading: boolean;
}

const CREATE_LANGUAGE = `
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation CreateLanguage($input: CreateLanguageInput!) {
    createLanguage(createLanguageInput: $input) {
      ...MutationResponseFields
    }
  }
`;

const UPDATE_LANGUAGE = `
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {
    updateLanguage(id: $id, updateLanguageInput: $input) {
      ...MutationResponseFields
    }
  }
`;

const DELETE_LANGUAGE = `
  ${DELETE_RESPONSE_FRAGMENT}
  mutation DeleteLanguage($id: String!) {
    deleteLanguage(id: $id) {
      ...DeleteResponseFields
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
        input: validationResult.data
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
        id,
        input: validationResult.data
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

  return {
    createLanguage,
    updateLanguage,
    deleteLanguage,
    loading
  };
}

export default useLanguageMutations;