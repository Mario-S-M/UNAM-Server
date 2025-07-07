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
        return;
      }

      if (content === lastSavedContent) {
        return;
      }

      if (!content || content.trim() === "") {
        return;
      }

      try {
        setIsSaving(true);
        const result = await updateContentMarkdown(contentId, content);

        if (result.error) {
          onError?.(result.error);
          onSave?.(false, content);
        } else {
          setLastSavedContent(content);
          setLastSaveTime(new Date());
          onSave?.(true, content);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
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

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
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
