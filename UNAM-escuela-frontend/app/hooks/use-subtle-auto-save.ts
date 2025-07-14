"use client";

import { useCallback, useRef, useState } from "react";
import { updateContentMarkdown } from "../actions/content-actions";

interface UseSubtleAutoSaveOptions {
  contentId?: string;
  enabled?: boolean;
  interval?: number; // en milisegundos, default 2000
}

interface UseSubtleAutoSaveReturn {
  isSaving: boolean;
  lastSaveTime: Date | null;
  scheduleAutoSave: (content: string) => void;
  saveNow: (content: string) => Promise<boolean>;
}

/**
 * Hook de auto-guardado sutil que no interfiere con la experiencia del usuario.
 * Ideal para editores donde el guardado debe ser transparente.
 */
export function useSubtleAutoSave({
  contentId,
  enabled = true,
  interval = 2000,
}: UseSubtleAutoSaveOptions): UseSubtleAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

  const saveContent = useCallback(
    async (content: string): Promise<boolean> => {
      if (!contentId || !enabled) {
        return false;
      }

      // Evitar guardar contenido vacío o sin cambios
      if (
        !content ||
        content.trim() === "" ||
        content === lastContentRef.current
      ) {
        return false;
      }

      try {
        setIsSaving(true);
        const result = await updateContentMarkdown(contentId, content);

        if (result.error) {
          console.warn("💾 Auto-save: Error silencioso:", result.error);
          return false;
        } else {
          lastContentRef.current = content;
          setLastSaveTime(new Date());
          return true;
        }
      } catch (error) {
        console.warn("💾 Auto-save: Fallo silencioso:", error);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [contentId, enabled]
  );

  const scheduleAutoSave = useCallback(
    (content: string) => {
      if (!enabled || !contentId) return;

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Programar nuevo guardado
      timeoutRef.current = setTimeout(() => {
        saveContent(content);
      }, interval);
    },
    [enabled, contentId, interval, saveContent]
  );

  const saveNow = useCallback(
    async (content: string): Promise<boolean> => {
      // Cancelar guardado programado
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return await saveContent(content);
    },
    [saveContent]
  );

  return {
    isSaving,
    lastSaveTime,
    scheduleAutoSave,
    saveNow,
  };
}
