'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleSelector } from './RoleSelector';
import { EditFormData } from './types';

interface EditUserFormProps {
  editFormData: EditFormData;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

export function EditUserForm({ editFormData, setEditFormData }: EditUserFormProps) {
  const handleRoleChange = (role: string, checked: boolean) => {
    setEditFormData(prev => ({
      ...prev,
      roles: checked
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="edit-fullName" className="text-right">
          Nombre
        </Label>
        <Input
          id="edit-fullName"
          value={editFormData.fullName}
          onChange={(e) => setEditFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="col-span-3"
          placeholder="Nombre completo"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="edit-email" className="text-right">
          Email
        </Label>
        <Input
          id="edit-email"
          type="email"
          value={editFormData.email}
          onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
          className="col-span-3"
          placeholder="correo@ejemplo.com"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="edit-password" className="text-right">
          Contraseña
        </Label>
        <Input
          id="edit-password"
          type="password"
          value={editFormData.password}
          onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
          className="col-span-3"
          placeholder="Nueva contraseña (opcional)"
        />
      </div>
      
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