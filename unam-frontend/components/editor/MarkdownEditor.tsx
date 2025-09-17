'use client';

import * as React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Plate, usePlateEditor } from 'platejs/react';
import { MarkdownPlugin, deserializeMd } from '@platejs/markdown';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Badge } from '@/components/ui/badge';
import { useAutoSave } from '@/hooks/useAutoSave';
import { GET_CONTENT_MARKDOWN } from '@/lib/graphql/contentGraphqlSchema';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  contentId: string;
  contentName: string;
  className?: string;
}

const GET_CONTENT_MARKDOWN_QUERY = gql`${GET_CONTENT_MARKDOWN}`;

export function MarkdownEditor({ contentId, contentName, className }: MarkdownEditorProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [initialValue, setInitialValue] = React.useState<any[]>([{
    type: 'p',
    children: [{ text: '' }],
  }]);

  // Query para obtener el contenido markdown
  const { data, loading, error } = useQuery(GET_CONTENT_MARKDOWN_QUERY, {
    variables: { contentId },
    errorPolicy: 'all',
  });

  // Configurar el editor de Plate
  const editor = usePlateEditor({
    plugins: [
      ...EditorKit,
      MarkdownPlugin,
    ],
    value: initialValue,
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

  // Efecto para actualizar el valor inicial cuando se carga el contenido
  React.useEffect(() => {
    if (data?.contentMarkdown !== undefined) {
      try {
        const content = data.contentMarkdown;
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
          // Si está vacío, crear contenido inicial con título
          const initialContent = generateInitialContent(contentName);
          setInitialValue(initialContent);
          if (editor) {
            editor.children = initialContent;
          }
        }
      } catch (err) {
        console.error('Error parsing content:', err);
        toast.error('Error al procesar el contenido');
        const initialContent = generateInitialContent(contentName);
        setInitialValue(initialContent);
        if (editor) {
          editor.children = initialContent;
        }
      }
    }
  }, [data, editor]);

  // Manejar errores de la query
  React.useEffect(() => {
    if (error) {
      console.error('Error fetching markdown:', error);
      toast.error('Error al cargar el contenido markdown');
    }
  }, [error]);

  // Hook de guardado automático
  const { save } = useAutoSave({
    contentId,
    delay: 2000, // 2 segundos de delay
    onSaveStart: () => {
      setIsSaving(true);
    },
    onSaveSuccess: () => {
      setIsSaving(false);
      setLastSaved(new Date());
    },
    onSaveError: (error) => {
      setIsSaving(false);
      console.error('Error saving:', error);
    },
  });

  // Función para generar contenido inicial con título
  const generateInitialContent = (contentName: string) => {
    return [{
      type: 'h1',
      children: [{ text: `Título: Contenido ${contentName}` }],
    }, {
      type: 'p',
      children: [{ text: '' }],
    }];
  };

  // Manejar cambios en el editor
  const handleChange = React.useCallback(
    (value: any[]) => {
      try {
        // Siempre guardar como JSON
        const contentToSave = JSON.stringify(value, null, 2);
        save(contentToSave);
      } catch (error) {
        console.error('Error in handleChange:', error);
        // Fallback: guardar como texto plano
        const plainText = value
          .map((node: any) => {
            if (node.children) {
              return node.children.map((child: any) => child.text || '').join('');
            }
            return '';
          })
          .join('\n');
        save(plainText);
      }
    },
    [save]
  );

  // Formatear la fecha de último guardado
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (loading) {
    return (
      <div className={cn('h-full flex flex-col items-center justify-center', className)}>
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando editor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('h-full flex flex-col items-center justify-center', className)}>
        <div className="text-center text-red-500">
          <p>Error al cargar el editor</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Header con estado de guardado */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <h2 className="text-lg font-semibold">Editor de Contenido: {contentName}</h2>
        <div className="flex items-center gap-2">
          {isSaving && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
              <Save className="h-2.5 w-2.5 animate-pulse" />
              <span>Guardando...</span>
            </div>
          )}
          {!isSaving && lastSaved && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-50">
              <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
              <span>Guardado {formatLastSaved(lastSaved)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Editor que ocupa todo el espacio restante */}
      <div className="flex-1 overflow-hidden">
        <Plate 
          editor={editor}
          onChange={({ value }) => handleChange(value)}
        >
          <EditorContainer className="h-full">
            <Editor 
              variant="default"
              className="p-6 h-full focus-visible:outline-none"
              placeholder="Comienza a escribir el contenido..."
            />
          </EditorContainer>
        </Plate>
      </div>
      
      {/* Footer con información */}
      <div className="p-2 text-xs text-muted-foreground text-center border-t bg-muted/20 opacity-70">
        Autoguardado activado
      </div>
    </div>
  );
}