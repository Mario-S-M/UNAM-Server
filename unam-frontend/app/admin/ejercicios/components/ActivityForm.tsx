'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateActivityFormData } from '@/schemas/activity-forms';

interface ActivityFormProps {
  formData: UpdateActivityFormData;
  onFormDataChange: (updates: Partial<UpdateActivityFormData>) => void;
}

export function ActivityForm({ formData, onFormDataChange }: ActivityFormProps) {
  const handleInputChange = (field: keyof UpdateActivityFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFormDataChange({ [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Ejercicio *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name || ''}
          onChange={handleInputChange('name')}
          placeholder="Ingresa el nombre del ejercicio"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={handleInputChange('description')}
          placeholder="Describe brevemente el ejercicio"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="indication">Indicación *</Label>
        <Textarea
          id="indication"
          value={formData.indication || ''}
          onChange={handleInputChange('indication')}
          placeholder="Instrucciones para el estudiante"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="example">Ejemplo *</Label>
        <Textarea
          id="example"
          value={formData.example || ''}
          onChange={handleInputChange('example')}
          placeholder="Proporciona un ejemplo del ejercicio"
          rows={3}
          required
        />
      </div>


    </div>
  );
}