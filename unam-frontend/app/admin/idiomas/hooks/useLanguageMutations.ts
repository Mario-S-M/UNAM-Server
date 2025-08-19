import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageFormData, LanguageEntity } from '@/types';
import { toast } from 'sonner';
import { z } from 'zod';

interface UseLanguageMutationsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseLanguageMutationsReturn {
  createLanguage: (data: LanguageFormData) => Promise<boolean>;
  updateLanguage: (id: string, data: LanguageFormData) => Promise<boolean>;
  deleteLanguage: (id: string) => Promise<boolean>;
  loading: boolean;
}

const CREATE_LANGUAGE = `
  mutation CreateLanguage($input: CreateLanguageInput!) {
    createLanguage(createLanguageInput: $input) {
      id
      name
      code
      nativeName
      flag
      icons
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_LANGUAGE = `
  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {
    updateLanguage(id: $id, updateLanguageInput: $input) {
      id
      name
      code
      nativeName
      flag
      icons
      isActive
      createdAt
      updatedAt
    }
  }
`;

const DELETE_LANGUAGE = `
  mutation DeleteLanguage($id: String!) {
    deleteLanguage(id: $id) {
      id
      name
    }
  }
`;

const languageSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres').max(10, 'El código es demasiado largo'),
  nativeName: z.string().min(1, 'El nombre nativo es requerido').max(100, 'El nombre nativo es demasiado largo'),
  flag: z.string().default(''),
  icons: z.array(z.string().url('Cada icono debe ser una URL válida')).default([]),
  isActive: z.boolean().default(true)
});

const fetchGraphQL = async (query: string, variables: Record<string, any>, token: string) => {
  const response = await fetch('http://localhost:3000/graphql', {
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

  const validateData = (data: LanguageFormData): LanguageFormData => {
    try {
      return languageSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        throw new Error(firstError.message);
      }
      throw error;
    }
  };

  const createLanguage = useCallback(async (data: LanguageFormData): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const validatedData = validateData(data);
      
      const variables = {
        input: {
          name: validatedData.name,
          code: validatedData.code,
          nativeName: validatedData.nativeName,
          flag: validatedData.flag || '',
          icons: validatedData.icons,
          isActive: validatedData.isActive
        }
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

  const updateLanguage = useCallback(async (id: string, data: LanguageFormData): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const validatedData = validateData(data);
      
      const variables = {
        id,
        input: {
          name: validatedData.name,
          code: validatedData.code,
          nativeName: validatedData.nativeName,
          flag: validatedData.flag || '',
          icons: validatedData.icons,
          isActive: validatedData.isActive
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

  return {
    createLanguage,
    updateLanguage,
    deleteLanguage,
    loading
  };
}

export default useLanguageMutations;