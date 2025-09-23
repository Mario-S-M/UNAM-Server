'use client';

import React, { useEffect, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Plate, usePlateEditor } from 'platejs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit';
import { MarkdownPlugin } from '@platejs/markdown';
import { SuggestionPlugin } from '@platejs/suggestion/react';
import { createSuggestionOnlyToolbarKits } from '@/components/editor/plugins/suggestion-only-toolbar-kit';
import { Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlateComments } from '@/hooks/usePlateComments';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GET_CONTENT_MARKDOWN_PUBLIC = gql`
  query ContentMarkdownPublic($contentId: ID!) {
    contentMarkdownPublic(contentId: $contentId)
  }
`;

interface CommentOnlyMarkdownEditorProps {
  content?: string;
  readOnly?: boolean;
  contentId: string;
  onValidate?: () => void;
  className?: string;
}

// Función para convertir JSON de Plate a texto plano para mostrar
const plateJsonToText = (jsonContent: string): string => {
  try {
    const parsed = JSON.parse(jsonContent);
    if (Array.isArray(parsed)) {
      return parsed.map(node => {
        if (node.children) {
          return node.children.map((child: any) => child.text || '').join('');
        }
        return '';
      }).join('\n');
    }
    return jsonContent;
  } catch {
    return jsonContent;
  }
};

// Función para convertir JSON de Plate a valor inicial del editor
const parseContentForEditor = (content: string) => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Si no es JSON válido, crear estructura básica
  }
  
  // Fallback: crear estructura básica de Plate
  return [
    {
      type: 'p',
      children: [{ text: content || 'Contenido no disponible' }]
    }
  ];
};

// Componente del editor de revisión
function ReviewEditor({ content, readOnly, contentId }: {
  content: string;
  readOnly?: boolean;
  contentId: string;
}) {
  const { user } = useAuth();
  const { createComment, comments } = usePlateComments(contentId);
  const initialValue = useMemo(() => parseContentForEditor(content), [content]);
  
  // Crear los kits de barra de herramientas con contentId
  const { SuggestionOnlyFixedToolbarKit, SuggestionOnlyFloatingToolbarKit } = createSuggestionOnlyToolbarKits(contentId);
  
  // Configurar usuario actual y función de creación de comentarios
  const currentUserId = user?.id || 'anonymous';
  const currentUser = {
    id: currentUserId,
    name: user?.fullName || 'Usuario Anónimo',
    avatarUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${currentUserId}`,
  };
  
  // Función para manejar la creación de comentarios
  const handleCreateComment = async (commentData: any) => {
    try {
      await createComment({
        comment: commentData.comment || '',
        commentRich: JSON.stringify(commentData.contentRich || []),
        contentId,
        textSelection: commentData.textSelection,
        selectedText: commentData.selectedText,
        position: commentData.position,
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  
  const editor = usePlateEditor({
    plugins: [
      // Filtrar los kits de barra de herramientas estándar del EditorKit
      ...EditorKit.filter(plugin => 
        !plugin.key?.includes('fixed-toolbar') && 
        !plugin.key?.includes('floating-toolbar')
      ),
      // Agregar nuestros kits personalizados solo para suggestion
      ...SuggestionOnlyFixedToolbarKit,
      ...SuggestionOnlyFloatingToolbarKit,
      MarkdownPlugin,
      SuggestionPlugin.configure({
        options: {
          isSuggesting: true, // Siempre en modo suggestion
        },
      }),
      discussionPlugin.configure({
        options: {
          currentUserId: currentUserId,
          users: {
            [currentUserId]: currentUser,
          },
          discussions: [],
          contentId: contentId,
          onCreateComment: handleCreateComment,
        },
      }),
    ],
    value: initialValue,
    readOnly: false, // No usar readOnly para permitir suggestions
  });

  // Forzar el modo suggestion después de que el editor se monte
  useEffect(() => {
    if (editor) {
      editor.setOption(SuggestionPlugin, 'isSuggesting', true);
    }
  }, [editor]);

  return (
    <Plate editor={editor}>
      <EditorContainer className="min-h-[400px]">
        <Editor 
          variant="default" 
          className="min-h-[400px] p-4"
          placeholder="Haz sugerencias seleccionando texto y escribiendo cambios..."
        />
      </EditorContainer>
    </Plate>
  );
}

export default function CommentOnlyMarkdownEditor({
  content: propContent,
  contentId,
  readOnly = false,
  className,
  onValidate
}: CommentOnlyMarkdownEditorProps) {
  const { data, loading, error } = useQuery<{ contentMarkdownPublic: string }>(
    GET_CONTENT_MARKDOWN_PUBLIC,
    {
      variables: { contentId },
      errorPolicy: 'all',
      skip: !!propContent, // Skip query if content is provided as prop
    }
  );

  const content = propContent || data?.contentMarkdownPublic || '';

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando contenido...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <div className="text-center">
          <p className="text-red-500 mb-2">Error al cargar el contenido</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-none space-y-4", className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Editor de Contenido con Comentarios</CardTitle>
          {onValidate && (
            <Button 
              onClick={() => {
                onValidate();
                toast.success('Contenido validado exitosamente');
              }}
              className="ml-auto"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Validar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!readOnly && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>Instrucciones:</strong> Usa las herramientas del editor para agregar comentarios y sugerencias directamente en el texto.
              </p>
            </div>
          )}
          <div className="min-h-[500px] border rounded-md">
            <ReviewEditor 
              content={content}
              readOnly={readOnly}
              contentId={contentId}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}