'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, BookOpen, Filter, FileText, HelpCircle, CheckCircle, AlertCircle, Hash, Type, List, CheckSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useActivityManagement } from '@/content/hooks/useActivityManagement';
import { ActivityForm } from '@/components/ActivityForm';

interface Content {
  id: string;
  name: string;
  skill: {
    name: string;
  };
}

const GET_MY_ASSIGNED_CONTENTS = gql`
  query MyAssignedContents {
    myAssignedContents {
      id
      name
      skill {
        id
        name
        color
      }
    }
  }
`;

export default function ActivitiesManagement() {
  const router = useRouter();
  const {
    activities,
    loading,
    error,
    isModalOpen,
    editingActivity,
    formData,
    search,
    selectedContentId,
    createLoading,
    updateLoading,
    deleteLoading,
    setIsModalOpen,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDeleteActivity,
    handleModalClose,
    handleSearchChange,
    handleContentFilterChange,
  } = useActivityManagement();

  const { data: contentsData, loading: contentsLoading } = useQuery<{ myAssignedContents: any[] }>(
    GET_MY_ASSIGNED_CONTENTS,
    {
      errorPolicy: 'all'
    }
  );

  const contents = contentsData?.myAssignedContents || [];



  if (loading || contentsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando actividades...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error al cargar las actividades</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Actividades</h1>
          <p className="text-muted-foreground">
            Crea y gestiona actividades para tus contenidos asignados
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Actividad
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar actividades..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedContentId} onValueChange={handleContentFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por contenido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los contenidos</SelectItem>
            {contents.map((content) => (
              <SelectItem key={content.id} value={content.id}>
                {content.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de actividades */}
      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay actividades</h3>
            <p className="text-muted-foreground text-center mb-4">
              {search || selectedContentId
                ? 'No se encontraron actividades con los filtros aplicados'
                : 'Aún no has creado ninguna actividad'}
            </p>
            {!search && !selectedContentId && (
              <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear primera actividad
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => {
            const content = contents.find(c => c.id === activity.contentId);
            
            return (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{activity.name}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                      {content && (
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: content.skill?.color || '#6B7280' }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {content.name} - {content.skill?.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/teacher/activities/questions/${activity.id}`)}
                        title="Editar preguntas"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                        title="Editar actividad"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deleteLoading}
                            title="Eliminar actividad"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la actividad "{activity.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDeleteActivity(activity.id)}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Indicaciones:</h4>
                      <p className="text-sm text-muted-foreground">{activity.indication}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Ejemplo:</h4>
                      <p className="text-sm text-muted-foreground">{activity.example}</p>
                    </div>
                    
                    {/* Información de preguntas mejorada */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Preguntas del formulario
                        </h4>
                        {activity.form?.questions && activity.form.questions.length > 0 ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {activity.form.questions.length} pregunta{activity.form.questions.length !== 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Sin preguntas
                          </Badge>
                        )}
                      </div>
                      
                      {activity.form?.questions && activity.form.questions.length > 0 ? (
                        <div className="space-y-3">
                          {activity.form.questions.slice(0, 2).map((question, index) => {
                            const getQuestionIcon = (type: string) => {
                              switch (type) {
                                case 'TEXT':
                                case 'TEXTAREA':
                                  return <Type className="h-3 w-3" />;
                                case 'MULTIPLE_CHOICE':
                                  return <List className="h-3 w-3" />;
                                case 'CHECKBOX':
                                  return <CheckSquare className="h-3 w-3" />;
                                case 'NUMBER':
                                  return <Hash className="h-3 w-3" />;
                                default:
                                  return <FileText className="h-3 w-3" />;
                              }
                            };
                            
                            return (
                              <div key={question.id} className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-start gap-2 flex-1">
                                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-semibold mt-0.5">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm text-slate-800 leading-relaxed">
                                        {question.questionText}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs px-2 py-1 bg-white border-slate-300 text-slate-600 flex items-center gap-1">
                                          {getQuestionIcon(question.questionType)}
                                          {question.questionType}
                                        </Badge>
                                        {question.isRequired && (
                                          <Badge variant="destructive" className="text-xs px-2 py-1 bg-red-100 text-red-700 border-red-200">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Obligatoria
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {question.options && question.options.length > 0 && (
                                  <div className="mt-2 pl-8">
                                    <div className="flex items-center gap-1 text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 inline-flex">
                                      <List className="h-3 w-3" />
                                      {question.options.length} opción{question.options.length !== 1 ? 'es' : ''} disponible{question.options.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {activity.form.questions.length > 2 && (
                            <div className="text-center py-2">
                              <Badge variant="outline" className="text-xs px-3 py-1 bg-slate-100 text-slate-600 border-slate-300">
                                <Plus className="h-3 w-3 mr-1" />
                                {activity.form.questions.length - 2} pregunta{activity.form.questions.length - 2 !== 1 ? 's' : ''} adicional{activity.form.questions.length - 2 !== 1 ? 'es' : ''}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-orange-800 mb-1">
                                Sin preguntas configuradas
                              </p>
                              <p className="text-xs text-orange-700">
                                Haz clic en el botón de preguntas (?) para agregar y configurar las preguntas de esta actividad.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Creado: {new Date(activity.createdAt).toLocaleDateString()}</span>
                      <span>Actualizado: {new Date(activity.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
       )}
         
       <ActivityForm
         isOpen={isModalOpen}
         onClose={handleModalClose}
         onSubmit={handleSubmit}
         editingActivity={editingActivity}
         formData={formData}
         setFormData={setFormData}
         createLoading={createLoading}
         updateLoading={updateLoading}
       />
    </div>
  );
}