import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, Trash2, Edit } from 'lucide-react';
// import { Content } from '../types';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONTENT_COMMENTS, CREATE_CONTENT_COMMENT, UPDATE_CONTENT_COMMENT, DELETE_CONTENT_COMMENT } from '@/lib/graphql/queries';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ContentComment {
  id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
}

export function CommentModal({ isOpen, onClose, content }: CommentModalProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { user } = useAuth();

  // Verificar si el usuario tiene permisos para ver comentarios
  const canViewComments = user && (user.roles.includes('admin') || user.roles.includes('docente') || user.roles.includes('superUser'));

  const { data, loading, refetch } = useQuery(GET_CONTENT_COMMENTS, {
    variables: { contentId: content?.id },
    skip: !content?.id || !canViewComments,
  });

  const [createComment, { loading: createLoading }] = useMutation(CREATE_CONTENT_COMMENT, {
    onCompleted: () => {
      toast.success('Comentario creado exitosamente');
      setNewComment('');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error al crear comentario: ${error.message}`);
    },
  });

  const [updateComment, { loading: updateLoading }] = useMutation(UPDATE_CONTENT_COMMENT, {
    onCompleted: () => {
      toast.success('Comentario actualizado exitosamente');
      setEditingComment(null);
      setEditText('');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error al actualizar comentario: ${error.message}`);
    },
  });

  const [deleteComment, { loading: deleteLoading }] = useMutation(DELETE_CONTENT_COMMENT, {
    onCompleted: () => {
      toast.success('Comentario eliminado exitosamente');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error al eliminar comentario: ${error.message}`);
    },
  });

  const handleCreateComment = async () => {
    if (!newComment.trim() || !content?.id) return;

    await createComment({
      variables: {
        input: {
          comment: newComment.trim(),
          contentId: content.id,
        },
      },
    });
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return;

    await updateComment({
      variables: {
        input: {
          id: commentId,
          comment: editText.trim(),
        },
      },
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment({
      variables: {
        commentId,
      },
    });
  };

  const startEdit = (comment: ContentComment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const comments: ContentComment[] = data?.contentComments || [];

  // Si no tiene permisos, no mostrar el modal
  if (!canViewComments) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-3xl max-h-[85vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Comentarios - {content?.name}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-6">
          {/* Lista de comentarios */}
          <ScrollArea className="h-[350px] w-full">
            <div className="space-y-3 pr-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Cargando comentarios...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No hay comentarios
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border rounded p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">{comment.author.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.createdAt !== comment.updatedAt && (
                          <span className="text-xs text-muted-foreground">(editado)</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(comment)}
                          disabled={editingComment === comment.id}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Editar comentario..."
                          className="min-h-[60px] text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={updateLoading || !editText.trim()}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{comment.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Formulario para nuevo comentario */}
          <div className="space-y-3 border-t pt-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Agregar comentario..."
              className="min-h-[80px] text-sm"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/500
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cerrar
                </Button>
                <Button
                  onClick={handleCreateComment}
                  disabled={createLoading || !newComment.trim() || newComment.length > 500}
                >
                  {createLoading ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}