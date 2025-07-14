import { useCallback, useRef, useState } from "react";

interface UseSimpleAutoSaveOptions {
  onSave: (content: string) => Promise<void>;
  interval?: number; // en milisegundos, default 5000
  enabled?: boolean;
}

interface UseSimpleAutoSaveReturn {
  isSaving: boolean;
  lastSaveTime: Date | null;
  scheduleSave: (content: string) => void;
  saveNow: (content: string) => Promise<void>;
}

export function useSimpleAutoSave({
  onSave,
  interval = 5000,
  enabled = true,
}: UseSimpleAutoSaveOptions): UseSimpleAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

  const saveNow = useCallback(
    async (content: string) => {
      if (!enabled || isSaving) return;

      setIsSaving(true);
      try {
        await onSave(content);
        setLastSaveTime(new Date());
        lastContentRef.current = content;
      } catch (error) {
        console.error("Error al guardar:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, enabled, isSaving]
  );

  const scheduleSave = useCallback(
    (content: string) => {
      if (!enabled || content === lastContentRef.current) return;

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Programar nuevo guardado
      timeoutRef.current = setTimeout(() => {
        saveNow(content);
      }, interval);
    },
    [enabled, interval, saveNow]
  );

  return {
    isSaving,
    lastSaveTime,
    scheduleSave,
    saveNow,
  };
}
