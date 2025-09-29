'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  validateCreateUserForm,
  validateUpdateUserForm,
  type CreateUserFormData,
  type UpdateUserFormData 
} from '@/schemas/user-forms';
import { USER_MUTATION_RESPONSE_FRAGMENT, USER_DELETE_RESPONSE_FRAGMENT } from '@/lib/graphql/fragments';

interface UseUserMutationsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

const CREATE_USER = `
  ${USER_MUTATION_RESPONSE_FRAGMENT}
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ...UserMutationResponseFields
    }
  }
`;

const UPDATE_USER = `
  ${USER_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      ...UserMutationResponseFields
    }
  }
`;

const UPDATE_USER_ROLES = `
  ${USER_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      ...UserMutationResponseFields
    }
  }
`;

const DELETE_USER = `
  ${USER_DELETE_RESPONSE_FRAGMENT}
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      ...UserDeleteResponseFields
    }
  }
`;

const CHANGE_USER_PASSWORD = `
  ${USER_MUTATION_RESPONSE_FRAGMENT}
  mutation ChangeUserPassword($userId: ID!, $newPassword: String!) {
    changeUserPassword(userId: $userId, newPassword: $newPassword) {
      ...UserMutationResponseFields
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

export function useUserMutations({ onSuccess, onError }: UseUserMutationsProps = {}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const createUser = useCallback(async (formData: CreateUserFormData): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      // Validar datos del formulario
      const validationResult = validateCreateUserForm(formData);
      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues.map((e: any) => e.message).join(', ');
        toast.error(`Error de validación: ${errorMessage}`);
        onError?.(errorMessage);
        return false;
      }

      const variables = {
        createUserInput: {
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          roles: formData.roles,
          isActive: formData.isActive,
        }
      };
      
      await fetchGraphQL(CREATE_USER, variables, token);
      
      toast.success('Usuario creado exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al crear usuario: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error creating user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  const updateUser = useCallback(async (id: string, formData: UpdateUserFormData): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      // Validar datos del formulario
      const validationResult = validateUpdateUserForm(formData);
      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues.map((e: any) => e.message).join(', ');
        toast.error(`Error de validación: ${errorMessage}`);
        onError?.(errorMessage);
        return false;
      }

      // Separar la actualización de datos básicos y roles
      const basicData = {
        id,
        ...(formData.email && { email: formData.email }),
        ...(formData.fullName && { fullName: formData.fullName }),
        ...(formData.password && { password: formData.password }),
        ...(formData.isActive !== undefined && { isActive: formData.isActive }),
      };

      // Actualizar datos básicos si hay cambios
      const hasBasicChanges = formData.email || formData.fullName || formData.password || formData.isActive !== undefined;
      if (hasBasicChanges) {
        const basicVariables = { updateUserInput: basicData };
        await fetchGraphQL(UPDATE_USER, basicVariables, token);
      }

      // Actualizar roles si se proporcionaron
      if (formData.roles && formData.roles.length > 0) {
        const rolesVariables = {
          updateUserRolesInput: {
            id,
            roles: formData.roles
          }
        };
        await fetchGraphQL(UPDATE_USER_ROLES, rolesVariables, token);
      }
      
      toast.success('Usuario actualizado exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al actualizar usuario: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error updating user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const variables = { id };
      await fetchGraphQL(DELETE_USER, variables, token);
      
      toast.success('Usuario eliminado exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al eliminar usuario: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error deleting user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  const changeUserPassword = useCallback(async (userId: string, newPassword: string): Promise<boolean> => {
    if (!token) {
      const error = 'Token de autenticación no disponible';
      toast.error(error);
      onError?.(error);
      return false;
    }

    if (!newPassword.trim()) {
      const error = 'La nueva contraseña no puede estar vacía';
      toast.error(error);
      onError?.(error);
      return false;
    }

    try {
      setLoading(true);
      
      const variables = { userId, newPassword };
      await fetchGraphQL(CHANGE_USER_PASSWORD, variables, token);
      
      toast.success('Contraseña cambiada exitosamente');
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cambiar contraseña: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Error changing user password:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  return {
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    loading
  };
}

export default useUserMutations;