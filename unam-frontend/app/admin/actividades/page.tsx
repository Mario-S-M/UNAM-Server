'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, BookOpen, Users, Calendar, Filter } from 'lucide-react';

// GraphQL Queries
const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    activities {
      id
      name
      description
      indication
      example
      createdAt
      updatedAt
      contentId
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
        questions {
          id
          type
        }
      }
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

interface Activity {
  id: string;
  name: string;
  description: string;
  indication?: string;
  example?: string;
  createdAt: string;
  updatedAt: string;
  contentId: string;
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
    questions: {
      id: string;
      type: string;
    }[];
  };
}

export default function ActividadesAdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_ACTIVITIES, {
    errorPolicy: 'all'
  });

  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    onCompleted: (data) => {
      toast.success(`Actividad "${data.removeActivity.name}" eliminada exitosamente`);
      refetch();
      setActivityToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting activity:', error);
      toast.error('Error al eliminar la actividad');
    }
  });

  if (loading) {
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

  const activities: Activity[] = data?.activities || [];

  // Filtrar actividades
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(search.toLowerCase()) ||
                         activity.description.toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || activity.content.language.id === selectedLanguage;
    const matchesLevel = selectedLevel === 'all' || activity.content.level.id === selectedLevel;
    const matchesSkill = selectedSkill === 'all' || activity.content.skill.id === selectedSkill;
    
    return matchesSearch && matchesLanguage && matchesLevel && matchesSkill;
  });

  // Obtener opciones únicas para filtros
  const languages = Array.from(new Set(activities.map(a => a.content.language)))
    .filter((lang, index, self) => self.findIndex(l => l.id === lang.id) === index);
  const levels = Array.from(new Set(activities.map(a => a.content.level)))
    .filter((level, index, self) => self.findIndex(l => l.id === level.id) === index);
  const skills = Array.from(new Set(activities.map(a => a.content.skill)))
    .filter((skill, index, self) => self.findIndex(s => s.id === skill.id) === index);

  const handleDeleteActivity = async () => {
    if (!activityToDelete) return;
    
    try {
      await deleteActivity({ variables: { id: activityToDelete.id } });
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getQuestionTypesBadge = (activity: Activity) => {
    if (!activity.form?.questions || activity.form.questions.length === 0) {
      return <Badge variant="secondary">Sin preguntas</Badge>;
    }
    
    const questionCount = activity.form.questions.length;
    const types = Array.from(new Set(activity.form.questions.map(q => q.type)));
    
    return (
      <div className="flex gap-1 flex-wrap">
        <Badge variant="outline">{questionCount} pregunta{questionCount !== 1 ? 's' : ''}</Badge>
        {types.map(type => (
          <Badge key={type} variant="secondary" className="text-xs">
            {type === 'multiple_choice' ? 'Opción múltiple' :
             type === 'true_false' ? 'Verdadero/Falso' :
             type === 'short_answer' ? 'Respuesta corta' :
             type === 'essay' ? 'Ensayo' : type}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Actividades</h1>
          <p className="text-muted-foreground">
            Administra todas las actividades creadas por los profesores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredActivities.length} actividad{filteredActivities.length !== 1 ? 'es' : ''}
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar actividades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los idiomas</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language.id} value={language.id}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las skills</SelectItem>
            {skills.map((skill) => (
              <SelectItem key={skill.id} value={skill.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                  {skill.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de actividades */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay actividades</h3>
            <p className="text-muted-foreground text-center">
              {search || selectedLanguage !== 'all' || selectedLevel !== 'all' || selectedSkill !== 'all'
                ? 'No se encontraron actividades con los filtros aplicados'
                : 'Aún no hay actividades creadas por los profesores'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nombre</TableHead>
                  <TableHead className="text-center">Descripción</TableHead>
                  <TableHead className="text-center">Contenido</TableHead>
                  <TableHead className="text-center">Skill</TableHead>
                  <TableHead className="text-center">Preguntas</TableHead>
                  <TableHead className="text-center">Creada</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="text-center font-medium">
                      {activity.name}
                    </TableCell>
                    <TableCell className="text-center max-w-xs">
                      <div className="truncate" title={activity.description}>
                        {activity.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-medium">{activity.content.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.content.language.name} - {activity.content.level.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: activity.content.skill.color }}
                        />
                        <span>{activity.content.skill.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getQuestionTypesBadge(activity)}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/actividades/${activity.id}`)}
                          title="Ver detalles"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActivityToDelete(activity)}
                              title="Eliminar actividad"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente la actividad
                                "{activityToDelete?.name}" y todos sus datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setActivityToDelete(null)}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteActivity}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}