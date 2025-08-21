'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditUserForm } from './EditUserForm';
import { User, EditFormData } from './types';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  editFormData: EditFormData;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  onSave: () => void;
  loading: boolean;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  editFormData,
  setEditFormData,
  onSave,
  loading,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario. Los campos vacíos no se actualizarán.
          </DialogDescription>
        </DialogHeader>
        
        <EditUserForm
          editFormData={editFormData}
          setEditFormData={setEditFormData}
        />
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={loading || editFormData.roles.length === 0}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}