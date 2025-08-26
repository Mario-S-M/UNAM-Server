'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skill, Language, Level } from '../types';
import { CreateSkillFormData as SkillFormData } from '@/schemas/skill-forms';
import { SkillForm } from './SkillForm';
import { useSkillMutations } from '../hooks/useSkillMutations';

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: SkillFormData) => Promise<void>;
  editingSkill?: Skill | null | undefined;
  languages: Language[];
  levels: Level[];
  onLanguageChange: (languageId: string) => void;
  onSkillSaved?: () => void;
}

export const SkillDialog: React.FC<SkillDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingSkill,
  languages,
  levels,
  onLanguageChange,
  onSkillSaved
}) => {
  const { handleCreate, handleUpdate, handleImageUpload } = useSkillMutations();
  
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    imageUrl: '',
    icon: '',
    objectives: [],
    prerequisites: [],
    difficulty: 'Básico' as const,
    estimatedHours: 0,
    levelId: '',
  });
  
  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');

  // Reset form when dialog opens/closes or editing skill changes
  useEffect(() => {
    if (isOpen) {
      if (editingSkill) {
        const languageId = editingSkill.lenguageId || '';
        setSelectedLanguageId(languageId);
        
        // Si la skill tiene una imagen, mostrarla como preview
        if (editingSkill.imageUrl) {
          setImagePreview(editingSkill.imageUrl);
        } else {
          setImagePreview(null);
        }
        setSelectedImageFile(null);
        
        setFormData({
          name: editingSkill.name,
          description: editingSkill.description,
          color: editingSkill.color,
          imageUrl: editingSkill.imageUrl || '',
          icon: editingSkill.icon || '',
          objectives: editingSkill.objectives ? editingSkill.objectives.split('\n').filter(obj => obj.trim()) : [],
          prerequisites: editingSkill.prerequisites ? editingSkill.prerequisites.split('\n').filter(pre => pre.trim()) : [],
          difficulty: editingSkill.difficulty as 'Básico' | 'Intermedio' | 'Avanzado',
          estimatedHours: editingSkill.estimatedHours || 0,
          levelId: editingSkill.levelId || '',
        });
        
        if (languageId) {
          onLanguageChange(languageId);
        }
      } else {
        // Reset form for new skill
        resetForm();
      }
    }
  }, [isOpen, editingSkill, onLanguageChange]);

  const resetForm = () => {
    setSelectedLanguageId('');
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      imageUrl: '',
      icon: '',
      objectives: [],
      prerequisites: [],
      difficulty: 'Básico' as const,
      estimatedHours: 0,
      levelId: '',
    });
    setNewObjective('');
    setNewPrerequisite('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        if (editingSkill) {
          await handleUpdate(editingSkill.id, formData, selectedImageFile);
        } else {
          await handleCreate(formData, selectedImageFile);
        }
      }
      onClose();
      resetForm();
      if (onSkillSaved) {
        onSkillSaved();
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Error saving skill:', error);
    }
  };

  const handleImageUploadWrapper = async (file: File, fieldName: 'imageUrl') => {
    try {
      setUploadingImage(fieldName);
      const imageUrl = await handleImageUpload(file, fieldName, formData, languages, levels);
      setFormData(prev => ({ ...prev, [fieldName]: imageUrl }));
    } catch (error) {
      // Error handling is done in the mutation hook
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSkill ? 'Editar Skill' : 'Crear Nuevo Skill'}
          </DialogTitle>
          <DialogDescription>
            {editingSkill
              ? 'Modifica los datos del skill seleccionado.'
              : 'Completa los datos para crear un nuevo skill.'}
          </DialogDescription>
        </DialogHeader>
        
        <SkillForm
          formData={formData}
          setFormData={setFormData}
          languages={languages}
          levels={levels}
          selectedLanguageId={selectedLanguageId}
          setSelectedLanguageId={setSelectedLanguageId}
          onLanguageChange={onLanguageChange}
          newObjective={newObjective}
          setNewObjective={setNewObjective}
          newPrerequisite={newPrerequisite}
          setNewPrerequisite={setNewPrerequisite}
          selectedImageFile={selectedImageFile}
          setSelectedImageFile={setSelectedImageFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          uploadingImage={uploadingImage}
          onImageUpload={handleImageUploadWrapper}
          onSubmit={handleSubmit}
          editingSkill={editingSkill || null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SkillDialog;