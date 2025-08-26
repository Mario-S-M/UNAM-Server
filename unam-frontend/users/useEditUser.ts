'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { User } from './types';
import { UpdateUserRolesFormData as EditFormData } from '@/schemas/user-forms';
import { 
  validateUpdateUserForm, 
  validateUpdateUserRolesForm,
  type UpdateUserFormData,
  type UpdateUserRolesFormData,
  type ValidRoles 
} from '@/schemas/user-forms';

interface UseEditUserReturn {
  editingUser: User | null;
  editDialogOpen: boolean;
  editFormData: EditFormData;
  editLoading: boolean;
  setEditDialogOpen: (open: boolean) => void;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  handleEditUser: (user: User) => void;
  handleSaveUser: () => Promise<void>;
}

// Interfaces para tipado estricto
interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface GraphQLVariables {
  [key: string]: unknown;
}

interface UpdateUserInput {
  id: string;
  fullName?: string;
  email?: string;
  password?: string;
}

interface UseEditUserProps {
  onUserUpdated: () => void;
  fetchGraphQL: (query: string, variables?: GraphQLVariables, token?: string) => Promise<GraphQLResponse>;
  token?: string;
  UPDATE_USER: string;
  UPDATE_USER_ROLES: string;
}

export function useEditUser({
  onUserUpdated,
  fetchGraphQL,
  token,
  UPDATE_USER,
  UPDATE_USER_ROLES,
}: UseEditUserProps): UseEditUserReturn {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    id: '',
    roles: [],
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      id: user.id,
      roles: user.roles as ValidRoles[],
    });
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setEditLoading(true);
    try {
      // Actualizar roles
      const rolesData: UpdateUserRolesFormData = {
        id: editingUser.id,
        roles: editFormData.roles as ValidRoles[]
      };

      // Validar con Zod
      const rolesValidationResult = validateUpdateUserRolesForm(rolesData);
      if (!rolesValidationResult.success) {
        const errors = rolesValidationResult.error.issues.map(issue => issue.message).join(', ');
        toast.error(`Errores de validación de roles: ${errors}`);
        return;
      }

      const rolesResult = await fetchGraphQL(
        UPDATE_USER_ROLES,
        {
          updateUserRolesInput: rolesValidationResult.data
        },
        token
      );

      if (rolesResult.errors) {
        throw new Error(rolesResult.errors[0].message);
      }

      toast.success('Roles de usuario actualizados exitosamente');
      setEditDialogOpen(false);
      onUserUpdated();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error updating user roles:', error);
      toast.error(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  return {
    editingUser,
    editDialogOpen,
    editFormData,
    editLoading,
    setEditDialogOpen,
    setEditFormData,
    handleEditUser,
    handleSaveUser,
  };
}