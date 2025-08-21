'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Skill, SkillFormData, Language, Level } from '../types';

interface SkillFormProps {
  formData: SkillFormData;
  setFormData: React.Dispatch<React.SetStateAction<SkillFormData>>;
  languages: Language[];
  levels: Level[];
  selectedLanguageId: string;
  setSelectedLanguageId: (id: string) => void;
  onLanguageChange: (languageId: string) => void;
  newObjective: string;
  setNewObjective: (value: string) => void;
  newPrerequisite: string;
  setNewPrerequisite: (value: string) => void;
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  uploadingImage: string | null;
  onImageUpload: (file: File, fieldName: 'imageUrl') => Promise<void>;
  onSubmit: (e: React.FormEvent) => void;
  editingSkill: Skill | null;
}

export const SkillForm: React.FC<SkillFormProps> = ({
  formData,
  setFormData,
  languages,
  levels,
  selectedLanguageId,
  setSelectedLanguageId,
  onLanguageChange,
  newObjective,
  setNewObjective,
  newPrerequisite,
  setNewPrerequisite,
  selectedImageFile,
  setSelectedImageFile,
  imagePreview,
  setImagePreview,
  uploadingImage,
  onImageUpload,
  onSubmit,
  editingSkill
}) => {
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-6 py-4">
        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Skill *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Nombre del skill"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Corta</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Descripción del skill"
            />
          </div>
        </div>

        {/* Detalles Académicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Detalles Académicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lenguageId">Idioma *</Label>
              <Select
                value={formData.lenguageId}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, lenguageId: value, levelId: '' }));
                  setSelectedLanguageId(value);
                  onLanguageChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelId">Nivel *</Label>
              <Select
                value={formData.levelId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, levelId: value }))}
                disabled={!selectedLanguageId || levels.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedLanguageId ? "Seleccionar nivel" : "Primero selecciona un idioma"} />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} - {level.difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Duración Total (Horas)</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color del Tema</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 p-1 rounded cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Elementos Visuales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Elementos Visuales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageFile">Imagen Hero</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('imageFile')?.click()}
                    disabled={uploadingImage === 'imageUrl'}
                    className="flex items-center gap-2"
                  >
                    {uploadingImage === 'imageUrl' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Subir Imagen
                  </Button>
                  {(imagePreview || formData.imageUrl) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {(imagePreview || formData.imageUrl) && (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icono (Opcional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Nombre del icono o URL"
              />
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Objetivos de Aprendizaje</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Agregar nuevo objetivo"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
              />
              <Button type="button" onClick={addObjective} variant="outline">
                Agregar
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{objective}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prerrequisitos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Prerrequisitos</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                placeholder="Agregar nuevo prerrequisito"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
              />
              <Button type="button" onClick={addPrerequisite} variant="outline">
                Agregar
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{prerequisite}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrerequisite(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          {editingSkill ? 'Actualizar Skill' : 'Crear Skill'}
        </Button>
      </div>
    </form>
  );
};

export default SkillForm;