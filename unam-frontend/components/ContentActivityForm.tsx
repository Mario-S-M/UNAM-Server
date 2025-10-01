'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ActivityFormData, activityFormSchema, Activity } from '@/content/hooks/useActivityManagement';
import { ActivityQuestionBuilder } from './ActivityQuestionBuilder';
import { Separator } from '@/components/ui/separator';

interface ContentActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActivityFormData) => Promise<void>;
  editingActivity: Activity | null;
  formData: ActivityFormData;
  setFormData: (data: ActivityFormData) => void;
  createLoading: boolean;
  updateLoading: boolean;
  contentId: string; // El ID del contenido ya está definido
}

export function ContentActivityForm({
  isOpen,
  onClose,
  onSubmit,
  editingActivity,
  formData,
  setFormData,
  createLoading,
  updateLoading,
  contentId,
}: ContentActivityFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isLoading = createLoading || updateLoading;

  const validateForm = (): boolean => {
    try {
      // Asegurar que el contentId esté incluido en la validación
      const dataWithContentId = { ...formData, contentId };
      activityFormSchema.parse(dataWithContentId);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Incluir el contentId en los datos enviados
      const dataWithContentId = { ...formData, contentId };
      await onSubmit(dataWithContentId);
    }
  };

  const handleFieldChange = (field: keyof ActivityFormData, value: string) => {
    let processedValue: any = value;
    
    // Convertir estimatedTime a número
    if (field === 'estimatedTime') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
    }
    
    setFormData({ ...formData, [field]: processedValue });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingActivity ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
          </DialogTitle>
          <DialogDescription>
            {editingActivity
        ? 'Modifica los datos del ejercicio'
        : 'Completa los datos para crear un nuevo ejercicio en este contenido'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Ejercicio</Label>
            <Input
              id="name"
              placeholder="Ingresa el nombre del ejercicio"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente el ejercicio"
              className="min-h-[80px]"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="indication">Indicaciones</Label>
            <Textarea
              id="indication"
              placeholder="Proporciona las indicaciones detalladas para realizar el ejercicio"
              className="min-h-[100px]"
              value={formData.indication}
              onChange={(e) => handleFieldChange('indication', e.target.value)}
              disabled={isLoading}
            />
            {errors.indication && <p className="text-sm text-red-500">{errors.indication}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="example">Ejemplo</Label>
            <Textarea
              id="example"
              placeholder="Proporciona un ejemplo de cómo realizar el ejercicio"
              className="min-h-[100px]"
              value={formData.example}
              onChange={(e) => handleFieldChange('example', e.target.value)}
              disabled={isLoading}
            />
            {errors.example && <p className="text-sm text-red-500">{errors.example}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Tiempo Estimado (minutos)</Label>
            <Input
              id="estimatedTime"
              type="number"
              min="1"
              max="1440"
              placeholder="Tiempo estimado en minutos"
              value={formData.estimatedTime || ''}
              onChange={(e) => handleFieldChange('estimatedTime', e.target.value)}
              disabled={isLoading}
            />
            {errors.estimatedTime && <p className="text-sm text-red-500">{errors.estimatedTime}</p>}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <ActivityQuestionBuilder
              questions={formData.questions || []}
              onQuestionsChange={(questions) => setFormData({ ...formData, questions })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? editingActivity
          ? 'Actualizando...'
          : 'Creando...'
        : editingActivity
        ? 'Actualizar Ejercicio'
        : 'Crear Ejercicio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}