'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleSelector } from './RoleSelector';
import { UpdateUserRolesFormData as EditFormData } from '@/schemas/user-forms';

interface EditUserFormProps {
  editFormData: EditFormData;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export function EditUserForm({ editFormData, setEditFormData }: EditUserFormProps) {
  const handleRoleChange = (role: string, checked: boolean) => {
    setEditFormData(prev => ({
      ...prev,
      roles: checked
        ? [...prev.roles, role as any]
        : prev.roles.filter(r => r !== role)
    }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">
          Roles
        </Label>
        <div className="col-span-3">
          <RoleSelector
            selectedRoles={editFormData.roles}
            onRoleChange={handleRoleChange}
          />
        </div>
      </div>
    </div>
  );
}