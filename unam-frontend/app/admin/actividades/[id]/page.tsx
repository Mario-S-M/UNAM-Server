'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ActivityForm } from '../components/ActivityForm';
import { UpdateActivityFormData, validateActivityForm } from '@/schemas/activity-forms';

// GraphQL Queries
const GET_ACTIVITY = gql`
  query GetActivity($id: ID!) {
    activity(id: $id) {
      id
      name
      description
      indication
      example
      contentId
      createdAt
      updatedAt
      content {
        id
        name
        skill {
          id
          name
          color
        }
        level {
          id
          name
        }
        language {
          id
          name
        }
      }
      form {
        id
        title
        description
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          description
          placeholder
          imageUrl
          minValue
          maxValue
          minLabel
          maxLabel
          maxLength
          allowMultiline
          correctAnswer
          explanation
          incorrectFeedback
          points
          options {
            id
            optionText
            optionValue
            orderIndex
            imageUrl
            color
            isCorrect
          }
        }
      }
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
      updatedAt
    }
  }
`;

interface Activity {
  id: string;
  name: string;
  description: string;
  indication: string;
  example: string;

  contentId: string;
  createdAt: string;
  updatedAt: string;
  content: {
    id: string;
    name: string;
    skill: {
      id: string;
      name: string;
      color: string;
    };
    level: {
      id: string;
      name: string;
    };
    language: {
      id: string;
      name: string;
    };
  };
  form?: {
    id: string;
    title: string;
    description: string;
    questions: any[];
  };
}

export default function ActivityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  
  const [formData, setFormData] = useState<UpdateActivityFormData>({
    id: activityId,
    name: '',
    description: '',
    indication: '',
    example: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useQuery(GET_ACTIVITY, {
    variables: { id: activityId },
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.activity) {
        const activity = data.activity;
        setFormData({
          id: activity.id,
          name: activity.name,
          description: activity.description,
          indication: activity.indication,
          example: activity.example,

        });
      }
    }
  });

  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    onCompleted: (data) => {
      toast.success('Actividad actualizada exitosamente');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error updating activity:', error);
      toast.error('Error al actualizar la actividad');
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateActivityForm(formData, true);
    if (!validation.success) {
      const errors = validation.error.issues.map(issue => issue.message).join(', ');
      toast.error(errors || 'Error de validación');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateActivity({
        variables: {
          updateActivityInput: {
            id: formData.id,
            name: formData.name?.trim(),
            description: formData.description?.trim(),
            indication: formData.indication?.trim(),
            example: formData.example?.trim(),

          }
        }
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setIsSubmitting(false);
    }
  };

  const handleFormDataChange = (updates: Partial<UpdateActivityFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg">Cargando actividad...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.activity) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-500 mb-2">Error al cargar la actividad</div>
            <Button onClick={() => router.push('/admin/actividades')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a actividades
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activity: Activity = data.activity;
  const isFormValid = formData.name && formData.description && formData.indication && formData.example;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/actividades')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Actividad</h1>
            <p className="text-muted-foreground">
              Modifica los datos de la actividad "{activity.name}"
            </p>
          </div>
        </div>
      </div>

      {/* Información del contenido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Contenido</div>
              <div className="font-medium">{activity.content.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Idioma - Nivel</div>
              <div className="font-medium">
                {activity.content.language.name} - {activity.content.level.name}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Skill</div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: activity.content.skill.color }}
                />
                <span className="font-medium">{activity.content.skill.name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de edición */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de la Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ActivityForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/actividades')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Formulario</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.form ? (
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Título</div>
                  <div>{activity.form.title}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Preguntas</div>
                  <div>{activity.form.questions.length} pregunta{activity.form.questions.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No hay formulario asociado</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fechas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Creada</div>
                <div>{new Date(activity.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Última actualización</div>
                <div>{new Date(activity.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}