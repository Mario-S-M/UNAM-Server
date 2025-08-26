"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileText, Calendar, User, Zap } from "lucide-react";
import { toast } from "sonner";

interface Content {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  userId: string;
  markdownPath: string;
  validationStatus: string;
  publishedAt?: string;
  skill: {
    id: string;
    name: string;
    description: string;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  skillId: string;
  assignedTeachers: {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
    isActive: boolean;
  }[];
}

const GET_CONTENT_BY_ID = gql`
  query ContentById($id: ID!) {
    content(id: $id) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      markdownPath
      validationStatus
      publishedAt
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
      }
      skillId
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
    }
  }
`;

export default function TeacherContentDetail() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const { data, loading, error } = useQuery<{ content: Content }>(
    GET_CONTENT_BY_ID,
    {
      variables: { id: contentId },
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Error fetching content:', error);
        toast.error('Error al cargar el contenido');
      }
    }
  );

  const content = data?.content;

  const handleBack = () => {
    router.push('/teacher');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando contenido...</span>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p>No se pudo cargar el contenido</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error?.message || 'Contenido no encontrado o sin permisos de acceso'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Badge 
          variant={content.validationStatus === 'validado' ? 'default' : 'secondary'}
        >
          {content.validationStatus === 'validado' ? 'Validado' : 'Sin validar'}
        </Badge>
      </div>

      {/* Información del contenido */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div 
              className="h-4 w-4 rounded-full mt-1"
              style={{ backgroundColor: content.skill?.color || '#6B7280' }}
            />
            <div className="flex-1">
              <CardTitle className="text-2xl">{content.name}</CardTitle>
              <CardDescription className="text-base mt-1">
                {content.description || 'Sin descripción disponible'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información del skill */}
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Skill:</span>
            <span className="text-sm">{content.skill?.name || 'Sin skill asignado'}</span>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Creado:</span>
              <span className="text-sm">{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Actualizado:</span>
              <span className="text-sm">{new Date(content.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Profesores asignados */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Profesores asignados:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.assignedTeachers?.length > 0 ? (
                content.assignedTeachers.map((teacher) => (
                  <Badge key={teacher.id} variant="outline">
                    {teacher.fullName}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Sin profesores asignados</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
          <CardDescription>
            Gestiona el contenido de este material educativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
            >
              <FileText className="h-6 w-6" />
              <span>Editar Contenido</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
            >
              <FileText className="h-6 w-6" />
              <span>Ver Markdown</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">ID del contenido:</span>
            <span className="ml-2 font-mono text-muted-foreground">{content.id}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">ID del nivel:</span>
            <span className="ml-2 font-mono text-muted-foreground">{content.levelId}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Ruta del archivo:</span>
            <span className="ml-2 font-mono text-muted-foreground">
              {content.markdownPath || 'No definida'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}