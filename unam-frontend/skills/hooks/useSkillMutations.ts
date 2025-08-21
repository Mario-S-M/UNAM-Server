import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SkillFormData, GraphQLVariables } from '../types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

const CREATE_SKILL = `
  mutation CreateSkill($createSkillInput: CreateSkillInput!) {
    createSkill(createSkillInput: $createSkillInput) {
      id
      name
      description
      color
      imageUrl
      icon
      objectives
      prerequisites
      difficulty
      estimatedHours
      tags
      isActive
      levelId
      lenguageId
      level {
        id
        name
        description
        difficulty
      }
      lenguage {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_SKILL = `
  mutation UpdateSkill($updateSkillInput: UpdateSkillInput!) {
    updateSkill(updateSkillInput: $updateSkillInput) {
      id
      name
      description
      color
      imageUrl
      icon
      objectives
      prerequisites
      difficulty
      estimatedHours
      tags
      isActive
      levelId
      lenguageId
      level {
        id
        name
        description
        difficulty
      }
      lenguage {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_SKILL = `
  mutation DeleteSkill($id: ID!) {
    removeSkill(id: $id) {
      id
      name
    }
  }
`;

// Función helper para manejar errores
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
};

export const useSkillMutations = (refreshCallback?: () => void) => {
  const { token } = useAuth();

  const createSkill = useCallback(async (formData: SkillFormData, selectedImageFile?: File | null) => {
    try {
      let imageUrl = formData.imageUrl;
      
      // Si hay una imagen seleccionada, subirla primero
      if (selectedImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImageFile);
        
        // Generar un skillId temporal para nuevas skills
        const skillId = `temp-${Date.now()}`;
        formDataUpload.append('skillId', skillId);
        
        const uploadResponse = await fetch('http://localhost:3000/uploads/skill-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl;
        } else {
          throw new Error('Error al subir la imagen');
        }
      }
      
      // Filtrar campos vacíos para evitar errores de validación en el backend
      const submitData: any = {
        name: formData.name
      };
      
      // Solo incluir campos que no estén vacíos
      if (formData.description && formData.description.trim() !== '') submitData.description = formData.description;
      if (formData.color && formData.color.trim() !== '' && /^#[0-9A-Fa-f]{6}$/.test(formData.color)) submitData.color = formData.color;
      if (imageUrl && imageUrl.trim() !== '') submitData.imageUrl = imageUrl;
      if (formData.icon && formData.icon.trim() !== '') submitData.icon = formData.icon;
      if (formData.objectives && formData.objectives.length > 0) submitData.objectives = formData.objectives.join('\n');
      if (formData.prerequisites && formData.prerequisites.length > 0) submitData.prerequisites = formData.prerequisites.join('\n');
      if (formData.difficulty) submitData.difficulty = formData.difficulty;
      if (formData.estimatedHours > 0) submitData.estimatedHours = formData.estimatedHours;
      if (formData.tags && formData.tags.length > 0) submitData.tags = formData.tags;
      if (formData.levelId && formData.levelId !== '') submitData.levelId = formData.levelId;
      if (formData.lenguageId && formData.lenguageId !== '') submitData.lenguageId = formData.lenguageId;
      
      await fetchGraphQL(
        CREATE_SKILL,
        { createSkillInput: submitData },
        token || undefined
      );
      toast.success('Habilidad creada exitosamente');
      if (refreshCallback) refreshCallback();
    } catch (error) {
      console.error('Error creating skill:', error);
      toast.error('Error al crear la habilidad');
      throw error;
    }
  }, [token]);

  const updateSkill = useCallback(async (skillId: string, formData: SkillFormData, selectedImageFile?: File | null) => {
    try {
      let imageUrl = formData.imageUrl;
      
      // Si hay una imagen seleccionada, subirla primero
      if (selectedImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImageFile);
        formDataUpload.append('skillId', skillId);
        
        const uploadResponse = await fetch('http://localhost:3000/uploads/skill-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl;
        } else {
          throw new Error('Error al subir la imagen');
        }
      }
      
      // Filtrar campos vacíos para evitar errores de validación en el backend
      const submitData: any = {
        id: skillId,
        name: formData.name
      };
      
      // Solo incluir campos que no estén vacíos
      if (formData.description && formData.description.trim() !== '') submitData.description = formData.description;
      if (formData.color && formData.color.trim() !== '' && /^#[0-9A-Fa-f]{6}$/.test(formData.color)) submitData.color = formData.color;
      if (imageUrl && imageUrl.trim() !== '') submitData.imageUrl = imageUrl;
      if (formData.icon && formData.icon.trim() !== '') submitData.icon = formData.icon;
      if (formData.objectives && formData.objectives.length > 0) submitData.objectives = formData.objectives.join('\n');
      if (formData.prerequisites && formData.prerequisites.length > 0) submitData.prerequisites = formData.prerequisites.join('\n');
      if (formData.difficulty) submitData.difficulty = formData.difficulty;
      if (formData.estimatedHours > 0) submitData.estimatedHours = formData.estimatedHours;
      if (formData.tags && formData.tags.length > 0) submitData.tags = formData.tags;
      if (formData.levelId && formData.levelId !== '') submitData.levelId = formData.levelId;
      if (formData.lenguageId && formData.lenguageId !== '') submitData.lenguageId = formData.lenguageId;
      
      await fetchGraphQL(
        UPDATE_SKILL,
        { updateSkillInput: submitData },
        token || undefined
      );
      toast.warning('Habilidad actualizada exitosamente');
      if (refreshCallback) refreshCallback();
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Error al actualizar la habilidad');
      throw error;
    }
  }, [token]);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      await fetchGraphQL(DELETE_SKILL, { id }, token || undefined);
      toast.error('Habilidad eliminada exitosamente');
      if (refreshCallback) refreshCallback();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Error al eliminar la habilidad');
      throw error;
    }
  }, [token]);

  const handleImageUpload = useCallback(async (file: File, fieldName: 'imageUrl', formData: SkillFormData, languages: any[], levels: any[]) => {
    if (!file) return '';
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      throw new Error('Tipo de archivo inválido');
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB permitido');
      throw new Error('Archivo demasiado grande');
    }
    
    try {
      // Crear FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);
      
      // Agregar datos de la entidad si están disponibles
      if (formData.lenguageId) {
        formDataToSend.append('languageId', formData.lenguageId);
        const selectedLanguage = languages.find(lang => lang.id === formData.lenguageId);
        if (selectedLanguage) {
          formDataToSend.append('languageName', selectedLanguage.name);
        }
      }
      
      if (formData.levelId) {
        formDataToSend.append('levelId', formData.levelId);
        const selectedLevel = levels.find(level => level.id === formData.levelId);
        if (selectedLevel) {
          formDataToSend.append('levelName', selectedLevel.name);
        }
      }
      
      if (formData.name) {
        formDataToSend.append('skillName', formData.name);
      }
      
      // Usar el endpoint específico de skills si tenemos los datos necesarios
      const endpoint = (formData.lenguageId && formData.levelId) 
        ? 'http://localhost:3000/uploads/skill-image'
        : 'http://localhost:3000/uploads/image/public';
      
      const headers: HeadersInit = {};
      if (token && (formData.lenguageId && formData.levelId)) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Subir archivo al backend
      const uploadResponse = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formDataToSend,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const uploadResult = await uploadResponse.json();
      toast.success('Imagen subida exitosamente');
      return uploadResult.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
      throw error;
    }
  }, [token]);

  return {
    handleCreate: createSkill,
    handleUpdate: updateSkill,
    handleDelete: deleteSkill,
    handleImageUpload
  };
};