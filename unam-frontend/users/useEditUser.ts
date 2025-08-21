'use client';

import { useState } from 'react';
import { User, EditFormData } from './types';

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

interface UseEditUserProps {
  onUserUpdated: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  fetchGraphQL: (query: string, variables?: any, token?: string) => Promise<any>;
  token?: string;
  UPDATE_USER: string;
  UPDATE_USER_ROLES: string;
}

export function useEditUser({
  onUserUpdated,
  showToast,
  fetchGraphQL,
  token,
  UPDATE_USER,
  UPDATE_USER_ROLES,
}: UseEditUserProps): UseEditUserReturn {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    fullName: '',
    email: '',
    password: '',
    roles: [],
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
      roles: user.roles,
    });
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setEditLoading(true);
    try {
      // Preparar datos para actualización básica
      const updateData: any = { id: editingUser.id };
      
      if (editFormData.fullName.trim() && editFormData.fullName !== editingUser.fullName) {
        updateData.fullName = editFormData.fullName.trim();
      }
      
      if (editFormData.email.trim() && editFormData.email !== editingUser.email) {
        updateData.email = editFormData.email.trim();
      }
      
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      // Actualizar datos básicos si hay cambios
      if (Object.keys(updateData).length > 1) {
        const updateResult = await fetchGraphQL(
          UPDATE_USER,
          { updateUserInput: updateData },
          token
        );

        if (updateResult.errors) {
          throw new Error(updateResult.errors[0].message);
        }
      }

      // Actualizar roles si han cambiado
      const rolesChanged = JSON.stringify(editFormData.roles.sort()) !== JSON.stringify(editingUser.roles.sort());
      if (rolesChanged) {
        const rolesResult = await fetchGraphQL(
          UPDATE_USER_ROLES,
          {
            updateUserRolesInput: {
              id: editingUser.id,
              roles: editFormData.roles,
            },
          },
          token
        );

        if (rolesResult.errors) {
          throw new Error(rolesResult.errors[0].message);
        }
      }

      showToast('Usuario actualizado exitosamente', 'success');
      setEditDialogOpen(false);
      onUserUpdated();
    } catch (error: any) {
      console.error('Error updating user:', error);
      showToast(error.message || 'Error al actualizar usuario', 'error');
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