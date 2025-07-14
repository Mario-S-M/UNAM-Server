import { useCallback, useRef, useState } from "react";
import { updateContentMarkdown } from "../actions/content-actions";

interface UseAutoSaveOptions {
  contentId?: string;
  enabled?: boolean;
  interval?: number; // en milisegundos
  onSave?: (success: boolean, content: string) => void;
  onError?: (error: string) => void;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaveTime: Date | null;
  lastSavedContent: string;
  scheduleAutoSave: (content: string) => void;
  saveNow: (content: string) => Promise<void>;
  clearScheduledSave: () => void;
}

export function useAutoSave({
  contentId,
  enabled = false,
  interval = 5000,
  onSave,
  onError,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log("🔧 useAutoSave hook inicializado", {
    contentId,
    enabled,
    interval,
    hasOnSave: !!onSave,
    hasOnError: !!onError,
  });

  const saveContent = useCallback(
    async (content: string) => {
      if (!contentId || !enabled) {
        console.log("⏭️ Auto-save: Deshabilitado o sin contentId", {
          contentId,
          enabled,
        });
        return;
      }

      if (!content || content.trim() === "") {
        console.log("⏭️ Auto-save: Contenido vacío, no guardando");
        return;
      }

      console.log("💾 Auto-save: Iniciando guardado...", {
        contentId,
        contentLength: content.length,
        timestamp: new Date().toISOString(),
        lastSavedLength: lastSavedContent.length,
      });

      try {
        setIsSaving(true);
        const result = await updateContentMarkdown(contentId, content);

        if (result.error) {
          console.error("❌ Auto-save: Error del servidor:", result.error);
          onError?.(result.error);
          onSave?.(false, content);
        } else {
          console.log("✅ Auto-save: Guardado exitoso");
          setLastSavedContent(content);
          setLastSaveTime(new Date());
          onSave?.(true, content);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        console.error(
          "❌ Auto-save: Excepción durante guardado:",
          errorMessage
        );
        onError?.(errorMessage);
        onSave?.(false, content);
      } finally {
        setIsSaving(false);
      }
    },
    [contentId, enabled, lastSavedContent, onSave, onError]
  );

  const scheduleAutoSave = useCallback(
    (content: string) => {
      if (!enabled || !contentId) {
        console.log(
          "⏭️ Auto-save: Programación cancelada (deshabilitado o sin contentId)"
        );
        return;
      }

      if (!content || content.trim() === "") {
        console.log("⏭️ Auto-save: Contenido vacío, no programando");
        return;
      }

      console.log("⏰ Auto-save: Programando guardado en", interval, "ms");

      if (saveTimeoutRef.current) {
        console.log("⏰ Auto-save: Cancelando guardado anterior");
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        console.log("⏰ Auto-save: Ejecutando guardado programado");
        saveContent(content);
      }, interval);
    },
    [enabled, contentId, interval, saveContent]
  );

  const saveNow = useCallback(
    async (content: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      await saveContent(content);
    },
    [saveContent]
  );

  const clearScheduledSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, []);

  return {
    isSaving,
    lastSaveTime,
    lastSavedContent,
    scheduleAutoSave,
    saveNow,
    clearScheduledSave,
  };
}
