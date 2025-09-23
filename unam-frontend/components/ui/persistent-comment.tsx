'use client';

import * as React from 'react';
import type { CreatePlateEditorOptions } from 'platejs/react';
import { getCommentKey, getDraftCommentKey } from '@platejs/comment';
import { CommentPlugin, useCommentId } from '@platejs/comment/react';
import { ArrowUpIcon } from 'lucide-react';
import { type Value, KEYS, nanoid, NodeApi } from 'platejs';
import {
  Plate,
  useEditorRef,
  usePlateEditor,
  usePluginOption,
} from 'platejs/react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit';
import {
  type TDiscussion,
  discussionPlugin,
} from '@/components/editor/plugins/discussion-kit';
import { usePlateComments } from '@/hooks/usePlateComments';

import { Editor, EditorContainer } from './editor';

const useCommentEditor = (
  options: Omit<CreatePlateEditorOptions, 'plugins'> = {},
  deps: any[] = []
) => {
  const commentEditor = usePlateEditor(
    {
      id: 'comment',
      plugins: BasicMarksKit,
      value: [],
      ...options,
    },
    deps
  );

  return commentEditor;
};

export function PersistentCommentCreateForm({
  autoFocus = false,
  className,
  discussionId: discussionIdProp,
  focusOnMount = false,
  contentId,
}: {
  autoFocus?: boolean;
  className?: string;
  discussionId?: string;
  focusOnMount?: boolean;
  contentId: string;
}) {
  const discussions = usePluginOption(discussionPlugin, 'discussions');
  const { createComment } = usePlateComments(contentId);

  const editor = useEditorRef();
  const commentId = useCommentId();
  const discussionId = discussionIdProp ?? commentId;

  const userInfo = usePluginOption(discussionPlugin, 'currentUser');
  const [commentValue, setCommentValue] = React.useState<Value | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const commentContent = React.useMemo(
    () =>
      commentValue
        ? NodeApi.string({ children: commentValue, type: KEYS.p })
        : '',
    [commentValue]
  );
  const commentEditor = useCommentEditor();

  React.useEffect(() => {
    if (commentEditor && focusOnMount) {
      commentEditor.tf.focus();
    }
  }, [commentEditor, focusOnMount]);

  const onAddComment = React.useCallback(async () => {
    if (!commentValue || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Obtener información del texto seleccionado
      const commentsNodeEntry = editor
        .getApi(CommentPlugin)
        .comment.nodes({ at: [], isDraft: true });

      if (commentsNodeEntry.length === 0) {
        setIsSubmitting(false);
        return;
      }

      const documentContent = commentsNodeEntry
        .map(([node]) => node.text)
        .join('');

      // Obtener información de posición y selección
      const textSelection = JSON.stringify({
        paths: commentsNodeEntry.map(([, path]) => path),
        anchor: editor.selection?.anchor,
        focus: editor.selection?.focus,
      });

      const position = JSON.stringify({
        paths: commentsNodeEntry.map(([, path]) => path),
        timestamp: Date.now(),
      });

      // Crear comentario en el backend
      const savedComment = await createComment({
        comment: commentContent,
        commentRich: JSON.stringify(commentValue),
        contentId,
        textSelection,
        selectedText: documentContent,
        position,
      });

      if (savedComment) {
        // Limpiar el editor
        commentEditor.tf.reset();
        setCommentValue(undefined);

        // Crear la discusión local para la UI
        const _discussionId = savedComment.id;
        const newDiscussion: TDiscussion = {
          id: _discussionId,
          comments: [
            {
              id: savedComment.id,
              contentRich: commentValue,
              createdAt: new Date(savedComment.createdAt),
              discussionId: _discussionId,
              isEdited: savedComment.isEdited,
              userId: savedComment.userId,
            },
          ],
          createdAt: new Date(savedComment.createdAt),
          documentContent,
          isResolved: savedComment.isResolved,
          userId: savedComment.userId,
        };

        // Actualizar las discusiones en el plugin
        editor.setOption(discussionPlugin, 'discussions', [
          ...discussions,
          newDiscussion,
        ]);

        // Marcar el texto con el comentario
        const id = newDiscussion.id;
        commentsNodeEntry.forEach(([, path]) => {
          editor.tf.setNodes(
            {
              [getCommentKey(id)]: true,
            },
            { at: path, split: true }
          );
          editor.tf.unsetNodes([getDraftCommentKey()], { at: path });
        });

        toast.success('Comentario guardado exitosamente');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Error al guardar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  }, [commentValue, commentEditor.tf, contentId, createComment, editor, discussions, isSubmitting, commentContent]);

  return (
    <div className={cn('flex w-full', className)}>
      <div className="mt-2 mr-1 shrink-0">
        <Avatar className="size-5">
          <AvatarImage alt={userInfo?.name} src={userInfo?.avatarUrl} />
          <AvatarFallback>{userInfo?.name?.[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="relative flex grow gap-2">
        <Plate
          onChange={({ value }) => {
            setCommentValue(value);
          }}
          editor={commentEditor}
        >
          <EditorContainer variant="comment">
            <Editor
              variant="comment"
              className="min-h-[25px] grow pt-0.5 pr-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onAddComment();
                }
              }}
              placeholder="Escribe tu comentario..."
              autoComplete="off"
              autoFocus={autoFocus}
              disabled={isSubmitting}
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0.5 bottom-0.5 ml-auto size-6 shrink-0"
              disabled={commentContent.trim().length === 0 || isSubmitting}
              onClick={(e) => {
                e.stopPropagation();
                onAddComment();
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-full">
                <ArrowUpIcon className={cn(isSubmitting && 'animate-spin')} />
              </div>
            </Button>
          </EditorContainer>
        </Plate>
      </div>
    </div>
  );
}