"use client";

import { useCallback, useRef, useState } from "react";

interface UseAutoSaveOptions {
  onSave: (content: string) => Promise<void>;
  interval?: number;
  enabled?: boolean;
}

export function useAutoSave({
  onSave,
  interval = 5000,
  enabled = true,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

  const scheduleSave = useCallback(
    (content: string) => {
      if (!enabled || content === lastContentRef.current) return;

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Programar nuevo guardado
      timeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          await onSave(content);
          lastContentRef.current = content;
          setLastSaveTime(new Date());
        } catch (error) {
          console.error("Error al guardar:", error);
        } finally {
          setIsSaving(false);
        }
      }, interval);
    },
    [onSave, interval, enabled]
  );

  const saveNow = useCallback(
    async (content: string) => {
      if (!enabled) return;

      try {
        setIsSaving(true);
        await onSave(content);
        lastContentRef.current = content;
        setLastSaveTime(new Date());
      } catch (error) {
        console.error("Error al guardar:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, enabled]
  );

  const clearScheduled = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    isSaving,
    lastSaveTime,
    scheduleSave,
    saveNow,
    clearScheduled,
  };
}
