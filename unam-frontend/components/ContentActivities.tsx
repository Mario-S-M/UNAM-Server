"use client";

import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { ContentActivityForm } from "@/components/ContentActivityForm";
import { Activity as ActivityType, ActivityFormData } from "@/content/hooks/useActivityManagement";

// Usar el tipo Activity del hook existente
type Activity = ActivityType;

const GET_ACTIVITIES_BY_CONTENT = gql`
  query ActivitiesByContent($contentId: ID!) {
    activitiesByContent(contentId: $contentId) {
      id
      name
      description
      indication
      example
      contentId
      estimatedTime
      createdAt
      updatedAt
      userId
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
      estimatedTime
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
      estimatedTime
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

interface ContentActivitiesProps {
  contentId: string;
}

export function ContentActivities({ contentId }: ContentActivitiesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ActivityFormData>({
    name: '',
    description: '',
    indication: '',
    example: '',
    contentId: contentId,
    estimatedTime: 0
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ activitiesByContent: Activity[] }>(
    GET_ACTIVITIES_BY_CONTENT,
    {
      variables: { contentId },
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Error fetching activities:', error);
        toast.error('Error al cargar las actividades');
      }
    }
  );

  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    onCompleted: (data) => {
      toast.success(`Actividad "${data.createActivity.name}" creada exitosamente`);
      refetch();
    },
    onError: (error) => {
      console.error('Error creating activity:', error);
      toast.error('Error al crear la actividad');
    }
  });

  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    onCompleted: (data) => {
      toast.success(`Actividad "${data.updateActivity.name}" actualizada exitosamente`);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating activity:', error);
      toast.error('Error al actualizar la actividad');
    }
  });

  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    onCompleted: (data) => {
      toast.success(`Actividad "${data.removeActivity.name}" eliminada exitosamente`);
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting activity:', error);
      toast.error('Error al eliminar la actividad');
    }
  });

  const activities = data?.activitiesByContent || [];
  
  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateActivity = () => {
    setEditingActivity(null);
    setFormData({
      name: '',
      description: '',
      indication: '',
      example: '',
      contentId: contentId,
      estimatedTime: 0
    });
    setShowForm(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      indication: activity.indication,
      example: activity.example,
      contentId: activity.contentId,
      estimatedTime: activity.estimatedTime
    });
    setShowForm(true);
  };

  const handleDeleteActivity = async (activity: Activity) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la actividad "${activity.name}"?`)) {
      try {
        await deleteActivity({ variables: { id: activity.id } });
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const handleFormSubmit = async (data: ActivityFormData) => {
    try {
      if (editingActivity) {
        setUpdateLoading(true);
        await updateActivity({
          variables: {
            updateActivityInput: {
              id: editingActivity.id,
              ...data
            }
          }
        });
        setUpdateLoading(false);
      } else {
        setCreateLoading(true);
        await createActivity({
          variables: {
            createActivityInput: data
          }
        });
        setCreateLoading(false);
      }
      setShowForm(false);
      setEditingActivity(null);
    } catch (error) {
      setCreateLoading(false);
      setUpdateLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Cargando actividades...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Error al cargar las actividades</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Actividades</CardTitle>
            <CardDescription>
              Gestiona las actividades para este contenido
            </CardDescription>
          </div>
          <Button onClick={handleCreateActivity}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Actividad
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista de actividades */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'No se encontraron actividades que coincidan con la búsqueda' : 'No hay actividades creadas para este contenido'}
            </p>
            {!searchTerm && (
              <Button variant="outline" onClick={handleCreateActivity} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear primera actividad
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{activity.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Creada: {new Date(activity.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditActivity(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteActivity(activity)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Formulario de actividad */}
        <ContentActivityForm
          isOpen={showForm}
          onClose={handleFormCancel}
          onSubmit={handleFormSubmit}
          editingActivity={editingActivity}
          formData={formData}
          setFormData={setFormData}
          createLoading={createLoading}
          updateLoading={updateLoading}
          contentId={contentId}
        />
      </CardContent>
    </Card>
  );
}