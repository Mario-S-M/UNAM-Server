'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  GET_PLATE_COMMENTS,
  CREATE_PLATE_COMMENT,
  UPDATE_PLATE_COMMENT,
  DELETE_PLATE_COMMENT,
  RESOLVE_PLATE_COMMENT,
} from '@/lib/graphql/queries';

export interface PlateComment {
  id: string;
  comment: string;
  commentRich?: string;
  textSelection?: string;
  selectedText?: string;
  position?: string;
  isResolved: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
  };
}

export interface CreatePlateCommentInput {
  comment: string;
  commentRich?: string;
  contentId: string;
  textSelection?: string;
  selectedText?: string;
  position?: string;
}

export interface UpdatePlateCommentInput {
  id: string;
  comment?: string;
  commentRich?: string;
  textSelection?: string;
  selectedText?: string;
  position?: string;
  isResolved?: boolean;
}

export const usePlateComments = (contentId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  // Query para obtener comentarios
  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(GET_PLATE_COMMENTS, {
    variables: { contentId },
    skip: !contentId,
    errorPolicy: 'all',
  });

  // Mutación para crear comentario
  const [createCommentMutation] = useMutation(CREATE_PLATE_COMMENT, {
    refetchQueries: [{ query: GET_PLATE_COMMENTS, variables: { contentId } }],
    onError: (error) => {
      console.error('Error creating plate comment:', error);
      toast.error('Error al crear el comentario');
    },
  });

  // Mutación para actualizar comentario
  const [updateCommentMutation] = useMutation(UPDATE_PLATE_COMMENT, {
    refetchQueries: [{ query: GET_PLATE_COMMENTS, variables: { contentId } }],
    onError: (error) => {
      console.error('Error updating plate comment:', error);
      toast.error('Error al actualizar el comentario');
    },
  });

  // Mutación para eliminar comentario
  const [deleteCommentMutation] = useMutation(DELETE_PLATE_COMMENT, {
    refetchQueries: [{ query: GET_PLATE_COMMENTS, variables: { contentId } }],
    onError: (error) => {
      console.error('Error deleting plate comment:', error);
      toast.error('Error al eliminar el comentario');
    },
  });

  // Mutación para resolver comentario
  const [resolveCommentMutation] = useMutation(RESOLVE_PLATE_COMMENT, {
    refetchQueries: [{ query: GET_PLATE_COMMENTS, variables: { contentId } }],
    onError: (error) => {
      console.error('Error resolving plate comment:', error);
      toast.error('Error al resolver el comentario');
    },
  });

  // Función para crear comentario
  const createComment = async (input: CreatePlateCommentInput) => {
    try {
      setIsLoading(true);
      const result = await createCommentMutation({
        variables: {
          createPlateCommentInput: input,
        },
      });
      toast.success('Comentario creado exitosamente');
      return result.data?.createPlateComment;
    } catch (error) {
      console.error('Error in createComment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar comentario
  const updateComment = async (input: UpdatePlateCommentInput) => {
    try {
      setIsLoading(true);
      const result = await updateCommentMutation({
        variables: {
          updatePlateCommentInput: input,
        },
      });
      toast.success('Comentario actualizado exitosamente');
      return result.data?.updatePlateComment;
    } catch (error) {
      console.error('Error in updateComment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar comentario
  const deleteComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      await deleteCommentMutation({
        variables: { commentId },
      });
      toast.success('Comentario eliminado exitosamente');
    } catch (error) {
      console.error('Error in deleteComment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resolver comentario
  const resolveComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      const result = await resolveCommentMutation({
        variables: { commentId },
      });
      toast.success('Comentario resuelto exitosamente');
      return result.data?.resolvePlateComment;
    } catch (error) {
      console.error('Error in resolveComment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    comments: (data?.plateComments as PlateComment[]) || [],
    loading: queryLoading || isLoading,
    error,
    refetch,
    createComment,
    updateComment,
    deleteComment,
    resolveComment,
  };
};