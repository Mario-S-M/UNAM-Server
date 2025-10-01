'use client';

import * as React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Plate, usePlateEditor } from 'platejs/react';
import { MarkdownPlugin, deserializeMd } from '@platejs/markdown';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { AlignKit } from '@/components/editor/plugins/align-kit';
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit';
import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit';
import { BlockMenuKit } from '@/components/editor/plugins/block-menu-kit';
import { BlockPlaceholderKit } from '@/components/editor/plugins/block-placeholder-kit';
import { CalloutKit } from '@/components/editor/plugins/callout-kit';
import { CodeBlockKit } from '@/components/editor/plugins/code-block-kit';
import { ColumnKit } from '@/components/editor/plugins/column-kit';
import { CommentKit } from '@/components/editor/plugins/comment-kit';
import { CursorOverlayKit } from '@/components/editor/plugins/cursor-overlay-kit';
import { DateKit } from '@/components/editor/plugins/date-kit';
import { DiscussionKit } from '@/components/editor/plugins/discussion-kit';
import { DndKit } from '@/components/editor/plugins/dnd-kit';
import { DocxKit } from '@/components/editor/plugins/docx-kit';
import { EmojiKit } from '@/components/editor/plugins/emoji-kit';
import { ExitBreakKit } from '@/components/editor/plugins/exit-break-kit';
import { FixedToolbarKit } from '@/components/editor/plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@/components/editor/plugins/floating-toolbar-kit';
import { FontKit } from '@/components/editor/plugins/font-kit';
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit';
import { LinkKit } from '@/components/editor/plugins/link-kit';
import { ListKit } from '@/components/editor/plugins/list-kit';
import { MarkdownKit } from '@/components/editor/plugins/markdown-kit';
import { MathKit } from '@/components/editor/plugins/math-kit';
import { MediaKit } from '@/components/editor/plugins/media-kit';
import { MentionKit } from '@/components/editor/plugins/mention-kit';
import { SlashKit } from '@/components/editor/plugins/slash-kit';
import { SuggestionKit } from '@/components/editor/plugins/suggestion-kit';
import { TableKit } from '@/components/editor/plugins/table-kit';
import { TocKit } from '@/components/editor/plugins/toc-kit';
import { ToggleKit } from '@/components/editor/plugins/toggle-kit';
import { TrailingBlockPlugin } from 'platejs';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Badge } from '@/components/ui/badge';
import { useAutoSave } from '@/hooks/useAutoSave';
import { GET_CONTENT_MARKDOWN } from '@/lib/graphql/contentGraphqlSchema';
import { cn } from '@/lib/utils';
import { ContentProvider } from '@/contexts/ContentContext';
import { DocumentImporter } from '@/components/editor/DocumentImporter';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherMarkdownEditorProps {
  contentId: string;
  contentName: string;
  className?: string;
}

const GET_CONTENT_MARKDOWN_QUERY = gql`${GET_CONTENT_MARKDOWN}`;

export function TeacherMarkdownEditor({ contentId, contentName, className }: TeacherMarkdownEditorProps) {
  const { user, token } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const [editorValue, setEditorValue] = React.useState<any[]>([{
    type: 'p',
    children: [{ text: '' }],
  }]);
  const [isContentLoaded, setIsContentLoaded] = React.useState(false);
  const [currentContentId, setCurrentContentId] = React.useState<string | null>(null);

  // Query para obtener el contenido markdown
  const { data, loading, error } = useQuery(GET_CONTENT_MARKDOWN_QUERY, {
    variables: { contentId: contentId.toString() },
    errorPolicy: 'all',
    skip: !contentId || !user || !token, // Skip query if not authenticated or contentId not available
    onError: (error) => {
      // Show user-friendly error message
      if (error.message.includes('Variable "$contentId"')) {
        toast.error('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else {
        toast.error('Error al cargar el contenido. Inténtalo de nuevo.');
      }
    }
  });



  // Show loading or authentication message
  if (!user || !token) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Configurar el editor de Plate con todos los plugins excepto AIKit
  const editor = usePlateEditor({
    plugins: [
      // Elements
      ...BasicBlocksKit,
      ...CodeBlockKit,
      ...TableKit,
      ...ToggleKit,
      ...TocKit,
      ...MediaKit,
      ...CalloutKit,
      ...ColumnKit,
      ...MathKit,
      ...DateKit,
      ...LinkKit,
      ...MentionKit,

      // Marks
      ...BasicMarksKit,
      ...FontKit,

      // Block Style
      ...ListKit,
      ...AlignKit,
      ...LineHeightKit,

      // Collaboration
      ...DiscussionKit,
      ...CommentKit,
      ...SuggestionKit,

      // Editing
      ...SlashKit,
      ...AutoformatKit,
      ...CursorOverlayKit,
      ...BlockMenuKit,
      ...DndKit,
      ...EmojiKit,
      ...ExitBreakKit,
      TrailingBlockPlugin,

      // Parsers
      ...DocxKit,
      ...MarkdownKit,

      // UI
      ...BlockPlaceholderKit,
      ...FixedToolbarKit,
      ...FloatingToolbarKit,
      
      // Markdown support
      MarkdownPlugin,
    ],
    value: editorValue,
  })

  // Resetear el flag de contenido cargado cuando cambie el contentId
  React.useEffect(() => {
    if (currentContentId !== contentId) {
      console.log('🔄 ContentId changed from', currentContentId, 'to', contentId);
      setIsContentLoaded(false);
      setCurrentContentId(contentId);
    }
  }, [contentId, currentContentId]);

  // Verificar cuando el editor esté completamente inicializado
  React.useEffect(() => {
    if (editor && editor.children && Array.isArray(editor.children)) {
      setIsEditorReady(true);
    }
  }, [editor]);

  // Sincronizar editor.children con editorValue
  React.useEffect(() => {
    if (editor && editorValue && Array.isArray(editorValue) && editorValue.length > 0) {
      // Solo actualizar si editor.children es diferente de editorValue
      if (!editor.children || JSON.stringify(editor.children) !== JSON.stringify(editorValue)) {
        editor.children = [...editorValue];
      }
    }
  }, [editor, editorValue]);

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

  // Función para generar contenido inicial con título
  const generateInitialContent = React.useCallback((contentName: string) => {
    return [{
      type: 'h1',
      children: [{ text: `Título: Contenido ${contentName}` }],
    }, {
      type: 'p',
      children: [{ text: '' }],
    }];
  }, []);

  // Función para parsear contenido markdown o JSON
  const parseContent = React.useCallback((content: string | null | undefined, editorInstance?: any) => {
    // Manejar casos de contenido vacío, null o undefined
    if (content === null || content === undefined || content === '' || (typeof content === 'string' && content.trim() === '')) {
      return generateInitialContent(contentName);
    }

    try {
      // Intentar parsear como JSON primero
      const parsed = JSON.parse(content);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (jsonError) {
      // Si no es JSON válido, intentar como markdown solo si hay editor
      if (editorInstance) {
        try {
          const deserializedValue = deserializeMd(editorInstance, content);
          
          if (Array.isArray(deserializedValue) && deserializedValue.length > 0) {
            return deserializedValue;
          }
        } catch (mdError) {
          // Error silencioso para markdown
        }
      }
    }

    // Fallback: crear contenido básico con el texto
    return [{
      type: 'p',
      children: [{ text: content || '' }],
    }];
  }, [contentName, generateInitialContent]);

  // Efecto para actualizar el valor del editor cuando se carga el contenido
  React.useEffect(() => {
    // Solo procesar si no está cargando y no hay error
    if (!loading && !error && data && !isContentLoaded) {
      const parsedContent = parseContent(data.contentMarkdown, editor);
      setEditorValue(parsedContent);
      setIsContentLoaded(true);
    }
  }, [data, loading, error, parseContent, editor, isContentLoaded, contentId, currentContentId]);

  // Efecto para detectar cambios en el contenido y resetear el flag de carga
  const lastContentRef = React.useRef<string>('');
  
  React.useEffect(() => {
    if (data?.contentMarkdown && isContentLoaded) {
      const newContent = data.contentMarkdown;
      
      // Solo resetear si el contenido cambió externamente y es diferente al último conocido
      if (newContent && newContent !== lastContentRef.current) {
        lastContentRef.current = newContent;
        setIsContentLoaded(false);
      }
    }
  }, [data?.contentMarkdown, isContentLoaded]);

  // Manejar cambios en el editor
  const handleChange = React.useCallback(
    (value: any[]) => {
      try {
        // Siempre guardar como JSON
        const contentToSave = JSON.stringify(value, null, 2);
        save(contentToSave);
      } catch (error) {
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

  // Manejar contenido importado desde DocumentImporter
  const handleContentImported = React.useCallback(
    (importedContent: any[]) => {
      console.log('Contenido importado:', importedContent);
      
      try {
        // Normalizar el contenido importado
        const normalizedContent = Array.isArray(importedContent) && importedContent.length > 0 
          ? importedContent 
          : [{ type: 'p', children: [{ text: importedContent || '' }] }];

        // Actualizar el valor del editor
        setEditorValue(normalizedContent);
        
        // Guardar el contenido después de un pequeño delay para asegurar que el editor se actualice
        setTimeout(() => {
          const contentToSave = JSON.stringify(normalizedContent, null, 2);
          save(contentToSave);
        }, 100);
        
        toast.success('Contenido importado exitosamente');
      } catch (error) {
        console.error('Error al importar contenido:', error);
        toast.error('Error al importar el contenido');
      }
    },
    [save, editor]
  );

  if (loading || !isEditorReady || !editorValue || !Array.isArray(editorValue) || editorValue.length === 0) {
    return (
      <div className={cn('h-full flex flex-col items-center justify-center', className)}>
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{loading ? 'Cargando contenido...' : 'Inicializando editor...'}</span>
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
        <div className="flex items-center gap-3">
          {/* Botón de importar documento */}
          <DocumentImporter onContentImported={handleContentImported} />
          
          {/* Estado de guardado */}
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
      </div>
      
      {/* Editor que ocupa todo el espacio restante */}
      <div className="flex-1 overflow-hidden">
        <ContentProvider contentId={contentId} contentName={contentName}>
          {editor && editorValue && Array.isArray(editorValue) && editorValue.length > 0 && 
           editor.children && Array.isArray(editor.children) && editor.children.length > 0 ? (
            <Plate 
              key={JSON.stringify(editorValue)}
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
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Preparando editor...</span>
              </div>
            </div>
          )}
        </ContentProvider>
      </div>
      
      {/* Footer con información */}
      <div className="p-2 text-xs text-muted-foreground text-center border-t bg-muted/20 opacity-70">
        Autoguardado activado • Editor completo para profesores
      </div>
    </div>
  );
}