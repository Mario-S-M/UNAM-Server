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
import { ContentProvider } from '@/contexts/ContentContext';

interface TeacherMarkdownEditorProps {
  contentId: string;
  contentName: string;
  className?: string;
}

const GET_CONTENT_MARKDOWN_QUERY = gql`${GET_CONTENT_MARKDOWN}`;

export function TeacherMarkdownEditor({ contentId, contentName, className }: TeacherMarkdownEditorProps) {
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

  // Configurar el editor de Plate con todas las funcionalidades
  const editor = usePlateEditor({
    plugins: [
      ...EditorKit,
      MarkdownPlugin,
    ],
    value: initialValue,
  });

  // Hook de autoguardado
  const { save } = useAutoSave({
    contentId,
    onSaveStart: () => setIsSaving(true),
    onSaveSuccess: () => {
      setIsSaving(false);
      setLastSaved(new Date());
    },
    onSaveError: (error: Error) => {
      console.error('Error saving content:', error);
      toast.error('Error al guardar el contenido');
    },
  });

  // Función para formatear la fecha de último guardado
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }
  };

  // Función para parsear contenido markdown o JSON
  const parseContent = React.useCallback((content: string) => {
    if (!content || content.trim() === '') {
      return generateInitialContent(contentName);
    }

    try {
      // Intentar parsear como JSON primero
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Si no es JSON válido, intentar como markdown
      try {
        const deserializedValue = deserializeMd(editor, content);
        if (Array.isArray(deserializedValue) && deserializedValue.length > 0) {
          return deserializedValue;
        }
      } catch (mdError) {
        console.warn('Error parsing markdown:', mdError);
      }
    }

    // Fallback: crear contenido básico con el texto
    return [{
      type: 'p',
      children: [{ text: content }],
    }];
  }, [editor, contentName]);

  // Efecto para actualizar el valor inicial cuando se carga el contenido
  React.useEffect(() => {
    if (data?.contentMarkdown !== undefined) {
      const parsedContent = parseContent(data.contentMarkdown);
      setInitialValue(parsedContent);
      editor.tf.setValue(parsedContent);
    }
  }, [data?.contentMarkdown, parseContent, editor]);

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
        <ContentProvider contentId={contentId} contentName={contentName}>
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
        </ContentProvider>
      </div>
      
      {/* Footer con información */}
      <div className="p-2 text-xs text-muted-foreground text-center border-t bg-muted/20 opacity-70">
        Autoguardado activado • Editor completo para profesores
      </div>
    </div>
  );
}