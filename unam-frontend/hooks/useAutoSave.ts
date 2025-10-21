'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { UPDATE_CONTENT_MARKDOWN } from '@/lib/graphql/contentGraphqlSchema';

interface UseAutoSaveOptions {
  contentId: string;
  delay?: number; // Delay en milisegundos para el debounce
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  save: (content: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
}

const UPDATE_CONTENT_MARKDOWN_MUTATION = gql`${UPDATE_CONTENT_MARKDOWN}`;

export function useAutoSave({
  contentId,
  delay = 2000, // 2s para guardado más discreto
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<Date | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedContentRef = useRef<string>('');

  const [updateMarkdown] = useMutation(UPDATE_CONTENT_MARKDOWN_MUTATION, {
    onCompleted: () => {
      isSavingRef.current = false;
      lastSavedRef.current = new Date();
      onSaveSuccess?.();
    },
    onError: (error) => {
      isSavingRef.current = false;
      console.error('Error saving markdown:', error);
      onSaveError?.(error);
      // Guardado silencioso - sin notificaciones de error
    },
  });

  const performSave = useCallback(
    async (content: string) => {
      if (isSavingRef.current) return;
      
      try {
        isSavingRef.current = true;
        onSaveStart?.();
        
        await updateMarkdown({
          variables: {
            contentId,
            markdownContent: content,
          },
        });
        // Actualizar referencia del último contenido guardado
        lastSavedContentRef.current = content;
      } catch (error) {
        isSavingRef.current = false;
        console.error('Error in performSave:', error);
      }
    },
    [contentId, updateMarkdown, onSaveStart]
  );

  const save = useCallback(
    (content: string) => {
      // Evitar programar guardado si el contenido no cambió
      if (lastSavedContentRef.current && content === lastSavedContentRef.current) {
        return;
      }

      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configurar nuevo timeout para el debounce
      timeoutRef.current = setTimeout(() => {
        performSave(content);
      }, delay);
    },
    [performSave, delay]
  );

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    save,
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
  };
}