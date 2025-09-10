'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormQuestionData } from '@/schemas/form-forms';

// Tipos
export interface Activity {
  id: string;
  name: string;
  description: string;
  indication: string;
  example: string;
  contentId: string;
  formId?: string;
  form?: {
    id: string;
    title: string;
    questions: FormQuestionData[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityData {
  name: string;
  description: string;
  indication: string;
  example: string;
  contentId: string;
  formId?: string;
  questions?: FormQuestionData[];
}

export interface UpdateActivityData {
  id: string;
  name?: string;
  description?: string;
  indication?: string;
  example?: string;
  contentId?: string;
  formId?: string;
  questions?: FormQuestionData[];
}

// Schema de validación
export const activityFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(500, 'La descripción no puede exceder 500 caracteres'),
  indication: z.string().min(1, 'Las indicaciones son requeridas').max(1000, 'Las indicaciones no pueden exceder 1000 caracteres'),
  example: z.string().min(1, 'El ejemplo es requerido').max(1000, 'El ejemplo no puede exceder 1000 caracteres'),
  contentId: z.string().min(1, 'Debe seleccionar un contenido'),
  formId: z.string().optional(),
  questions: z.array(z.any()).optional(),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;

// GraphQL Queries y Mutations
const GET_ACTIVITIES = gql`
  query Activities {
    activities {
      id
      name
      description
      indication
      example
      contentId
      formId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          options {
            id
            optionText
            optionValue
            orderIndex
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_ACTIVITIES_BY_CONTENT = gql`
  query ActivitiesByContent($contentId: ID!) {
    activitiesByContent(contentId: $contentId) {
      id
      name
      description
      indication
      example
      contentId
      formId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          options {
            id
            optionText
            optionValue
            orderIndex
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ACTIVITY = gql`
  mutation CreateActivity($createActivityInput: CreateActivityInput!) {
    createActivity(createActivityInput: $createActivityInput) {
      id
      name
      description
      indication
      example
      contentId
      formId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          isRequired
          options {
            id
            optionText
            optionValue
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($updateActivityInput: UpdateActivityInput!) {
    updateActivity(updateActivityInput: $updateActivityInput) {
      id
      name
      description
      indication
      example
      contentId
      formId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          isRequired
          options {
            id
            optionText
            optionValue
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_ACTIVITY = gql`
  mutation RemoveActivity($id: ID!) {
    removeActivity(id: $id) {
      id
      name
    }
  }
`;

export function useActivityManagement() {
  // Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>({
    name: '',
    description: '',
    indication: '',
    example: '',
    contentId: '',
    formId: '',
    questions: [],
  });
  const [search, setSearch] = useState('');
  const [selectedContentId, setSelectedContentId] = useState<string>('all');

  // Queries
  const { data: activitiesData, loading: activitiesLoading, error: activitiesError, refetch: refetchActivities } = useQuery<{ activities: Activity[] }>(
    GET_ACTIVITIES,
    {
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Error fetching activities:', error);
        toast.error('Error al cargar las actividades');
      }
    }
  );

  // Mutations
  const [createActivityMutation, { loading: createLoading }] = useMutation(CREATE_ACTIVITY, {
    onCompleted: (data) => {
      refetchActivities();
    },
    onError: (error) => {
      console.error('Error creating activity:', error);
      toast.error('Error al crear la actividad');
    }
  });

  const [updateActivityMutation, { loading: updateLoading }] = useMutation(UPDATE_ACTIVITY, {
    onCompleted: (data) => {
      refetchActivities();
    },
    onError: (error) => {
      console.error('Error updating activity:', error);
      toast.error('Error al actualizar la actividad');
    }
  });

  const [deleteActivityMutation, { loading: deleteLoading }] = useMutation(DELETE_ACTIVITY, {
    onCompleted: (data) => {
      toast.success('Actividad eliminada exitosamente');
      refetchActivities();
    },
    onError: (error) => {
      console.error('Error deleting activity:', error);
      toast.error('Error al eliminar la actividad');
    }
  });

  // Funciones de manejo
  const handleCreateActivity = async (data: CreateActivityData): Promise<Activity> => {
    try {
      const result = await createActivityMutation({
        variables: {
          createActivityInput: data
        }
      });
      return result.data.createActivity;
    } catch (error) {
      console.error('Error in handleCreateActivity:', error);
      throw error;
    }
  };

  const handleUpdateActivity = async (data: UpdateActivityData): Promise<Activity> => {
    try {
      const result = await updateActivityMutation({
        variables: {
          updateActivityInput: data
        }
      });
      return result.data.updateActivity;
    } catch (error) {
      console.error('Error in handleUpdateActivity:', error);
      throw error;
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivityMutation({
        variables: { id }
      });
    } catch (error) {
      console.error('Error in handleDeleteActivity:', error);
    }
  };

  const handleSubmit = async (data: ActivityFormData): Promise<Activity> => {
    try {
      const validatedData = activityFormSchema.parse(data);
      
      // Filtrar campos vacíos para evitar errores de UUID
      const cleanedData = {
        ...validatedData,
        formId: validatedData.formId && validatedData.formId.trim() !== '' ? validatedData.formId : undefined
      };
      
      if (editingActivity) {
        return await handleUpdateActivity({
          id: editingActivity.id,
          ...cleanedData
        });
      } else {
        return await handleCreateActivity(cleanedData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Por favor, corrige los errores en el formulario');
      } else {
        console.error('Error in handleSubmit:', error);
      }
      throw error;
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      indication: activity.indication,
      example: activity.example,
      contentId: activity.contentId,
      formId: activity.formId || '',
      questions: activity.form?.questions || [],
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    setFormData({
      name: '',
      description: '',
      indication: '',
      example: '',
      contentId: '',
      formId: '',
      questions: [],
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleContentFilterChange = (value: string) => {
    setSelectedContentId(value);
  };

  // Datos procesados
  const activities = activitiesData?.activities || [];
  
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(search.toLowerCase()) ||
                         activity.description.toLowerCase().includes(search.toLowerCase());
    const matchesContent = selectedContentId === 'all' || activity.contentId === selectedContentId;
    return matchesSearch && matchesContent;
  });

  return {
    // Estados
    activities: filteredActivities,
    loading: activitiesLoading,
    error: activitiesError,
    isModalOpen,
    editingActivity,
    formData,
    search,
    selectedContentId,
    
    // Estados de carga
    createLoading,
    updateLoading,
    deleteLoading,
    
    // Funciones
    setIsModalOpen,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDeleteActivity,
    handleModalClose,
    handleSearchChange,
    handleContentFilterChange,
    refetchActivities,
  };
}