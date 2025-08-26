"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { GET_CONTENT_BY_ID_PUBLIC } from "@/lib/graphql/queries";

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



function getValidationStatusIcon(status: string) {
  switch (status) {
    case 'APPROVED':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'REJECTED':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function getValidationStatusText(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'Aprobado';
    case 'PENDING':
      return 'Pendiente';
    case 'REJECTED':
      return 'Rechazado';
    default:
      return status;
  }
}

function getValidationStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'APPROVED':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'REJECTED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function ContentDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<{ contentPublic: Content }>(
    GET_CONTENT_BY_ID_PUBLIC,
    {
      variables: { id },
      skip: !id,
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Error fetching content:', error);
        toast.error('Error al cargar el contenido');
      }
    }
  );



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando contenido...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              No se pudo cargar el contenido. Por favor, intenta nuevamente.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const content = data?.contentPublic;

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Contenido no encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              El contenido que buscas no existe o no tienes permisos para verlo.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Sin fecha';
    }
    
    try {
      // Handle both ISO string and timestamp formats
      let date;
      
      // If it's a numeric string (timestamp), convert to number first
      if (/^\d+$/.test(dateString)) {
        date = new Date(parseInt(dateString));
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return 'Sin fecha';
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Sin fecha';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Detalle del Contenido</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Información Principal */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{content.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {getValidationStatusIcon(content.validationStatus)}
                      {getValidationStatusText(content.validationStatus)}
                    </Badge>
                    {content.isCompleted && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {content.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Skill */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidad Asociada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div 
                  className="w-4 h-4 rounded-full mt-1" 
                  style={{ backgroundColor: content.skill.color || '#6B7280' }}
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{content.skill.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.skill.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profesores Asignados */}
          {content.assignedTeachers && content.assignedTeachers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Profesores Asignados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content.assignedTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{teacher.fullName}</p>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.roles?.map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        )) || (
                          <Badge variant="outline" className="text-xs">
                            Usuario
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle>Fechas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Creado</p>
                <p className="text-muted-foreground">{formatDate(content.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Actualizado</p>
                <p className="text-muted-foreground">{formatDate(content.updatedAt)}</p>
              </div>
            </div>
            {content.publishedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Publicado</p>
                  <p className="text-muted-foreground">{formatDate(content.publishedAt)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}