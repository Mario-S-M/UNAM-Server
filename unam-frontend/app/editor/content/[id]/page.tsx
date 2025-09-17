'use client';

import * as React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { gql } from '@apollo/client';

interface Content {
  id: string;
  name: string;
  description?: string;
  skill?: {
    id: string;
    name: string;
  };
}

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const GET_CONTENT_BY_ID = gql`
    query ContentById($id: ID!) {
      content(id: $id) {
        id
        name
        description
        skill {
          id
          name
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_CONTENT_BY_ID, {
    variables: { id: contentId },
    errorPolicy: 'all',
  });

  const content: Content | undefined = data?.content;

  const handleGoBack = () => {
    router.push(`/teacher/content/${contentId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col">
        <div className="border-b bg-card px-6 py-4 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold">Cargando...</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando contenido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col">
        <div className="border-b bg-card px-6 py-4 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold">Error</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error al cargar el contenido</p>
            <p className="text-muted-foreground">
              {error?.message || 'Contenido no encontrado'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{content.name}</h1>
              <p className="text-sm text-muted-foreground">
                Editando contenido
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor contentId={contentId} contentName={content.name} />
      </div>
    </div>
  );
}