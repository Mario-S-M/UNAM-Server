import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // Delay en milisegundos para el debounce
  enabled?: boolean;
  onError?: (error: Error) => void;
  minChangeThreshold?: number; // Mínimo número de caracteres que deben cambiar para activar guardado
}

/**
 * Hook para guardado automático con debounce
 * Guarda automáticamente los datos después de un período de inactividad
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 5000, // 5 segundos por defecto para ser más discreto
  enabled = true,
  onError,
  minChangeThreshold = 3 // Mínimo 3 caracteres de cambio para activar guardado
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const saveData = useCallback(async () => {
    if (isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      await onSave(data);
      lastSavedDataRef.current = JSON.stringify(data);
      // Guardado silencioso - sin notificaciones toast para ser más discreto
    } catch (error) {
      console.error('Error en guardado automático:', error);
      if (onError) {
        onError(error as Error);
      }
      // Solo mostrar error si es crítico, sin toast para mantener discreción
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, onError]);

  useEffect(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(data);
    
    // No guardar si los datos no han cambiado
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    // Verificar si el cambio es significativo (más discreto)
    const lastSaved = lastSavedDataRef.current;
    if (lastSaved && Math.abs(currentDataString.length - lastSaved.length) < minChangeThreshold) {
      // Si el cambio es muy pequeño, no guardar automáticamente
      return;
    }

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      saveData();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, saveData]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  return {
    forceSave,
    isSaving: isSavingRef.current
  };
}

/**
 * Hook simplificado para guardado automático de formularios
 */
export function useFormAutoSave<T extends Record<string, any>>({
  formData,
  onSave,
  delay = 8000, // 8 segundos para formularios, más tiempo para evitar guardados frecuentes
  enabled = true
}: {
  formData: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}) {
  return useAutoSave({
    data: formData,
    onSave,
    delay,
    enabled,
    onError: (error) => {
      console.error('Error en guardado automático del formulario:', error);
      // Sin toast para mantener la experiencia discreta
    }
  });
}