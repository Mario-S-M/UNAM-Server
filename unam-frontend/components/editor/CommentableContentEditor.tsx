'use client';

import * as React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Plate, usePlateEditor } from 'platejs/react';
import { MarkdownPlugin, deserializeMd } from '@platejs/markdown';
import { Loader2, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit';

const GET_CONTENT_MARKDOWN_PUBLIC = gql`
  query ContentMarkdownPublic($contentId: ID!) {
    contentMarkdownPublic(contentId: $contentId)
  }
`;

interface CommentableContentEditorProps {
  contentId: string;
  className?: string;
  currentUserId?: string;
  currentUserName?: string;
}

export function CommentableContentEditor({ 
  contentId, 
  className,
  currentUserId = 'student-1',
  currentUserName = 'Estudiante'
}: CommentableContentEditorProps) {
  const { data, loading, error } = useQuery<{ contentMarkdownPublic: string }>(
    GET_CONTENT_MARKDOWN_PUBLIC,
    {
      variables: { contentId },
      errorPolicy: 'all',
    }
  );

  const content = data?.contentMarkdownPublic;
  const [initialValue, setInitialValue] = React.useState<any[]>([{
    type: 'p',
    children: [{ text: 'Cargando contenido...' }],
  }]);

  // Configurar el editor de Plate con funcionalidad de comentarios
  const editor = usePlateEditor({
    plugins: [
      ...EditorKit,
      MarkdownPlugin,
      discussionPlugin.configure({
        options: {
          currentUserId,
          users: {
            [currentUserId]: {
              id: currentUserId,
              name: currentUserName,
              avatarUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${currentUserId}`,
            },
          },
          discussions: [],
        },
      }),
    ],
    value: initialValue,
    readOnly: false, // Permitir comentarios pero no edición del contenido principal
  });

  // Función para detectar si el contenido es JSON
  const isJsonContent = (content: string): boolean => {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  };

  // Función para generar contenido inicial
  const generateInitialContent = () => {
    return [
      {
        type: 'h1',
        children: [{ text: 'Contenido del Profesor' }],
      },
      {
        type: 'p',
        children: [{ text: 'Selecciona cualquier texto para agregar comentarios.' }],
      },
    ];
  };

  // Efecto para procesar el contenido cuando cambia
  React.useEffect(() => {
    if (content !== undefined) {
      try {
        if (content && content.trim()) {
          // Verificar si el contenido es JSON o markdown
          if (isJsonContent(content)) {
            // Es contenido JSON, parsearlo directamente
            const jsonContent = JSON.parse(content);
            setInitialValue(jsonContent);
            if (editor) {
              editor.children = jsonContent;
            }
          } else {
            // Es markdown, deserializarlo normalmente
            const deserializedContent = deserializeMd(editor, content);
            if (deserializedContent && deserializedContent.length > 0) {
              setInitialValue(deserializedContent);
              if (editor) {
                editor.children = deserializedContent;
              }
            } else {
              // Fallback si la deserialización falla
              const newValue = [{
                type: 'p',
                children: [{ text: content }],
              }];
              setInitialValue(newValue);
              if (editor) {
                editor.children = newValue;
              }
            }
          }
        } else {
          // Si está vacío, crear contenido inicial
          const initialContent = generateInitialContent();
          setInitialValue(initialContent);
          if (editor) {
            editor.children = initialContent;
          }
        }
      } catch (err) {
        console.error('Error procesando contenido:', err);
        toast.error('Error al cargar el contenido');
        // En caso de error, mostrar contenido básico
        const errorContent = [
          {
            type: 'h1',
            children: [{ text: 'Error' }],
          },
          {
            type: 'p',
            children: [{ text: 'No se pudo cargar el contenido.' }],
          },
        ];
        setInitialValue(errorContent);
        if (editor) {
          editor.children = errorContent;
        }
      }
    }
  }, [content, editor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando contenido...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>Error al cargar el contenido</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
        {/* Header con información de comentarios */}
        <div className="border-b p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <h2 className="font-semibold">Contenido con Comentarios</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {currentUserName}
              </Badge>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                Selecciona texto para comentar
              </div>
            </div>
          </div>
        </div>

        {/* Editor con funcionalidad de comentarios */}
        <div className="flex-1 overflow-auto">
          <Plate editor={editor}>
            <EditorContainer variant="demo">
              <Editor 
                className="min-h-full p-6"
                placeholder="Contenido del profesor..."
                readOnly={false}
              />
            </EditorContainer>
          </Plate>
        </div>
      </div>
  );
}