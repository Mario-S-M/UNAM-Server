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

  const saveContent = useCallback(
    async (content: string) => {
      if (!contentId || !enabled) {
        console.log("🚫 Auto-guardado deshabilitado o sin contentId");
        return;
      }

      if (content === lastSavedContent) {
        console.log("🚫 No hay cambios desde el último guardado");
        return;
      }

      // No guardar si el contenido está vacío o es solo espacios
      if (!content || content.trim() === "") {
        console.log("🚫 No se guarda contenido vacío");
        return;
      }

      try {
        setIsSaving(true);
        console.log("💾 Iniciando auto-guardado...");
        console.log(
          "📝 Contenido a guardar:",
          content.substring(0, 100) + "..."
        );

        const result = await updateContentMarkdown(contentId, content);

        if (result.error) {
          console.error("❌ Error al guardar:", result.error);
          onError?.(result.error);
          onSave?.(false, content);
        } else {
          setLastSavedContent(content);
          setLastSaveTime(new Date());
          console.log("✅ Auto-guardado completado exitosamente");
          onSave?.(true, content);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        console.error("❌ Error en auto-guardado:", errorMessage);
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
      if (!enabled || !contentId) return;

      // Limpiar timeout anterior si existe
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        console.log("🔄 Cancelando auto-guardado anterior programado");
      }

      // Programar nuevo auto-guardado para exactamente 5 segundos después
      console.log(
        `⏰ Programando auto-guardado en ${interval}ms (${interval / 1000}s)`
      );
      saveTimeoutRef.current = setTimeout(() => {
        console.log("🚀 Ejecutando auto-guardado programado...");
        saveContent(content);
      }, interval);
    },
    [enabled, contentId, interval, saveContent]
  );

  const saveNow = useCallback(
    async (content: string) => {
      // Cancelar auto-guardado programado
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      // Guardar inmediatamente
      await saveContent(content);
    },
    [saveContent]
  );

  const clearScheduledSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
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
