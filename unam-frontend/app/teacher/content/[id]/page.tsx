"use client";

import { useQuery, gql } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
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
      </div>

      {/* Información del contenido */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
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
            <Badge 
              variant={content.validationStatus === 'validado' ? 'default' : 'secondary'}
            >
              {content.validationStatus === 'validado' ? 'Validado' : 'Sin validar'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información básica del contenido sin skill ni fechas */}


        </CardContent>
      </Card>


    </div>
  );
}