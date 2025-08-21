'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RoleSelectorProps {
  selectedRoles: string[];
  onRoleChange: (role: string, checked: boolean) => void;
}

const AVAILABLE_ROLES = [
  { value: 'superUser', label: 'Super Usuario' },
  { value: 'admin', label: 'Administrador' },
  { value: 'docente', label: 'Docente' },
  { value: 'alumno', label: 'Alumno' },
  { value: 'mortal', label: 'Usuario' },
];

export function RoleSelector({ selectedRoles, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      {AVAILABLE_ROLES.map((role) => (
        <div key={role.value} className="flex items-center space-x-2">
          <Checkbox
            id={`role-${role.value}`}
            checked={selectedRoles.includes(role.value)}
            onCheckedChange={(checked) => onRoleChange(role.value, checked as boolean)}
          />
          <Label htmlFor={`role-${role.value}`} className="text-sm">
            {role.label}
          </Label>
        </div>
      ))}
    </div>
  );
}

export default RoleSelector;