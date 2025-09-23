'use client';

import { useQuery, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import CommentOnlyMarkdownEditor from '@/components/admin/CommentOnlyMarkdownEditor';
import { ContentActivitiesReadOnly } from '@/components/content/ContentActivitiesReadOnly';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, Eye, Lock } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  description: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

const GET_CONTENT_PUBLIC = gql`
  query ContentPublic($id: ID!) {
    contentPublic(id: $id) {
      id
      title
      description
      level
      createdAt
      updatedAt
      user {
        id
        name
      }
    }
  }
`;

export default function PublicContentPage() {
  const params = useParams();
  const contentId = params.id as string;

  const { data, loading, error } = useQuery<{ contentPublic: Content }>(
    GET_CONTENT_PUBLIC,
    {
      variables: { id: contentId },
      errorPolicy: 'all',
    }
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando contenido educativo...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.contentPublic) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 p-4 rounded-lg mb-4">
            <h1 className="text-xl font-semibold text-destructive mb-2">Contenido no disponible</h1>
            <p className="text-sm text-muted-foreground">
              {error?.message || 'El contenido solicitado no existe o no está disponible públicamente'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const content = data.contentPublic;

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header con indicador de vista pública */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Vista Pública
                </Badge>
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold">{content.title}</h1>
                <p className="text-xs text-muted-foreground">
                  Contenido educativo en modo solo lectura
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Nivel: {content.level}
            </Badge>
          </div>
        </div>
      </div>

      {/* Layout principal estilo Codecademy */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel lateral izquierdo - Información del contenido */}
        <div className="w-2/5 border-r bg-muted/20 flex flex-col">
          {/* Información del contenido */}
          <div className="p-4 border-b bg-background">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Información del Contenido
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-foreground">Descripción</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {content.description || 'Sin descripción disponible para este contenido educativo.'}
                  </p>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>Creado por: <span className="font-medium text-foreground">{content.user.name}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Fecha: <span className="font-medium text-foreground">{new Date(content.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenido Markdown */}
          <div className="flex-1 overflow-hidden">
            <CommentOnlyMarkdownEditor contentId={contentId} />
          </div>
        </div>

        {/* Área principal derecha - Ejercicios */}
        <div className="flex-1 flex flex-col bg-background">
          <ContentActivitiesReadOnly contentId={contentId} />
        </div>
      </div>
    </div>
  );
}