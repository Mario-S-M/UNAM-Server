'use client';

import * as React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Plate, usePlateEditor } from 'platejs/react';
import { MarkdownPlugin, deserializeMd } from '@platejs/markdown';
import { Loader2, Lock } from 'lucide-react';

import { ReadOnlyEditorKit } from '@/components/editor/read-only-editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { cn } from '@/lib/utils';

const GET_CONTENT_MARKDOWN_PUBLIC = gql`
  query ContentMarkdownPublic($contentId: ID!) {
    contentMarkdownPublic(contentId: $contentId)
  }
`;

interface ReadOnlyMarkdownEditorProps {
  contentId: string;
  className?: string;
}

export function ReadOnlyMarkdownEditor({ 
  contentId, 
  className 
}: ReadOnlyMarkdownEditorProps) {
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

  // Configurar el editor de Plate en modo solo lectura sin barras de herramientas
  const editor = usePlateEditor({
    plugins: [
      ...ReadOnlyEditorKit,
      MarkdownPlugin,
    ],
    value: initialValue,
    readOnly: true, // Modo solo lectura
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
        children: [{ text: 'Contenido Educativo' }],
      },
      {
        type: 'p',
        children: [{ text: 'Este contenido está disponible solo para lectura.' }],
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
        // En caso de error, mostrar contenido básico
        const errorContent = [
          {
            type: 'h1',
            children: [{ text: 'Contenido' }],
          },
          {
            type: 'p',
            children: [{ text: 'Error al cargar el contenido.' }],
          },
        ];
        setInitialValue(errorContent);
        if (editor) {
          editor.children = errorContent;
        }
      }
    }
  }, [content, editor]);

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando contenido...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Header con información de solo lectura */}
      <div className="border-b p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Contenido Educativo</h2>
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Solo lectura
          </div>
        </div>
      </div>

      {/* Editor en modo solo lectura sin barras de herramientas */}
      <div className="flex-1 overflow-auto">
        <Plate editor={editor}>
          <EditorContainer variant="demo">
            <Editor 
              className="min-h-full p-6"
              placeholder=""
              readOnly={true}
            />
          </EditorContainer>
        </Plate>
      </div>
    </div>
  );
}