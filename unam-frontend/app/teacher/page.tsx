"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { GET_MY_ASSIGNED_CONTENTS } from "@/lib/graphql/contentGraphqlSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
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

const MY_ASSIGNED_CONTENTS_QUERY = gql`${GET_MY_ASSIGNED_CONTENTS}`;

export default function TeacherDashboard() {
  const router = useRouter();
  
  const { data, loading, error } = useQuery<{ myAssignedContents: Content[] }>(
    MY_ASSIGNED_CONTENTS_QUERY,
    {
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Error fetching assigned contents:', error);
        toast.error('Error al cargar contenidos asignados');
      }
    }
  );

  const assignedContents = data?.myAssignedContents || [];
  
  const validatedContents = assignedContents.filter(content => content.validationStatus === 'validado');
  const unvalidatedContents = assignedContents.filter(content => content.validationStatus !== 'validado');

  const handleContentClick = (contentId: string) => {
    router.push(`/teacher/content/${contentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando contenidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Error al cargar los contenidos asignados</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contenidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedContents.length}</div>
            <p className="text-xs text-muted-foreground">
              Contenidos asignados a ti
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validatedContents.length}</div>
            <p className="text-xs text-muted-foreground">
              Contenidos aprobados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unvalidatedContents.length}</div>
            <p className="text-xs text-muted-foreground">
              Esperando validación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de contenidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mis Contenidos Asignados</h2>
        
        {assignedContents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No tienes contenidos asignados</p>
                <p className="text-sm">Contacta con el administrador para que te asigne contenidos.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedContents.map((content) => (
              <Card key={content.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleContentClick(content.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: content.skill?.color || '#6B7280' }}
                      />
                      <CardTitle className="text-base truncate">{content.name}</CardTitle>
                    </div>
                    <Badge 
                      variant={content.validationStatus === 'validado' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {content.validationStatus === 'validado' ? 'Validado' : 'Sin validar'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {content.skill?.name || 'Sin skill asignado'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {content.description || 'Sin descripción disponible'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Actualizado: {new Date(content.updatedAt).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      Ver contenido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}