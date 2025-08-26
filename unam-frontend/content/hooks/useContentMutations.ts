import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { CREATE_CONTENT, UPDATE_CONTENT, DELETE_CONTENT } from '@/lib/graphql/queries';
import { 
  validateContentForm,
  cleanContentFormData,
  type CreateContentFormData,
  type UpdateContentFormData 
} from '@/schemas/content-forms';
import { Content } from '../../types';

// Tipo unión para manejar tanto creación como actualización
type ContentFormData = CreateContentFormData | UpdateContentFormData;

interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

interface UseContentMutationsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseContentMutationsReturn {
  // Mutation functions
  handleCreate: (formData: ContentFormData) => Promise<void>;
  handleUpdate: (id: string, formData: ContentFormData) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  
  // Loading states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

export function useContentMutations({ 
  onSuccess, 
  onError 
}: UseContentMutationsProps = {}): UseContentMutationsReturn {
  
  // Mutations
  const [createContent, { loading: createLoading }] = useMutation(CREATE_CONTENT);
  const [updateContent, { loading: updateLoading }] = useMutation(UPDATE_CONTENT);
  const [deleteContent, { loading: deleteLoading }] = useMutation(DELETE_CONTENT);

  const handleCreate = async (formData: ContentFormData) => {
    try {
      // Limpiar y validar datos del formulario con Zod
      const cleanedData = cleanContentFormData(formData);
      const validationResult = validateContentForm(cleanedData, false);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
        const errorMessage = errors || 'Error de validación';
        toast.error(errorMessage);
        onError?.(errorMessage);
        return;
      }
      
      await createContent({
        variables: {
          createContentInput: validationResult.data
        }
      });
      
      toast.success('Contenido creado exitosamente');
      onSuccess?.();
    } catch (error: unknown) {
      const message = isErrorWithMessage(error) ? error.message : 'Error al crear el contenido';
      toast.error(message);
      onError?.(message);
    }
  };

  const handleUpdate = async (id: string, formData: ContentFormData) => {
    try {
      // Preparar datos para actualización incluyendo el ID
      const updateData: UpdateContentFormData = {
        id,
        ...formData
      };
      
      // Limpiar y validar datos del formulario con Zod
      const cleanedData = cleanContentFormData(updateData);
      const validationResult = validateContentForm(cleanedData, true);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
        const errorMessage = errors || 'Error de validación';
        toast.error(errorMessage);
        onError?.(errorMessage);
        return;
      }
      
      await updateContent({
        variables: {
          updateContentInput: validationResult.data
        }
      });
      
      toast.success('Contenido actualizado exitosamente');
      onSuccess?.();
    } catch (error: unknown) {
      const message = isErrorWithMessage(error) ? error.message : 'Error al actualizar el contenido';
      toast.error(message);
      onError?.(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent({
        variables: { id }
      });
      
      toast.success('Contenido eliminado exitosamente');
      onSuccess?.();
    } catch (error: unknown) {
      const message = isErrorWithMessage(error) ? error.message : 'Error al eliminar el contenido';
      toast.error(message);
      onError?.(message);
    }
  };

  return {
    // Mutation functions
    handleCreate,
    handleUpdate,
    handleDelete,
    
    // Loading states
    createLoading,
    updateLoading,
    deleteLoading
  };
}

export default useContentMutations;