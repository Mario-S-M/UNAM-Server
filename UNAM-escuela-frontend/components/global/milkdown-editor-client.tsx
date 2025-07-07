"use client";
import React, { useEffect, useCallback } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "../../app/milkdown-custom-theme.css"; // CSS personalizado DESPUÉS de los estilos de Milkdown
import { useAutoSave } from "../../app/hooks/use-auto-save";

interface MilkdownEditorClientProps {
  defaultValue: string;
  downloadFileName?: string;
  contentId?: string; // ID del contenido - si se proporciona, auto-guardado se activa automáticamente
  autoSaveInterval?: number; // Intervalo en milisegundos (default: 5000ms = 5s)
  onAutoSave?: (success: boolean, content: string) => void; // Callback cuando se guarda
  onAutoSaveError?: (error: string) => void; // Callback cuando hay error
  showButtons?: boolean; // Mostrar botones de guardar y descargar (default: true)
  showStatusIndicator?: boolean; // Mostrar indicador de estado (default: true)
  statusPosition?: "top" | "bottom"; // Posición del indicador (default: "bottom")
}

// Componente interno del editor que usa useEditor con Crepe
const MilkdownEditor: FC<MilkdownEditorClientProps> = ({
  defaultValue,
  downloadFileName = "content.md",
  contentId,
  autoSaveInterval = 5000,
  onAutoSave,
  onAutoSaveError,
  showButtons = true,
  showStatusIndicator = true,
  statusPosition = "bottom",
}) => {
  const [currentContent, setCurrentContent] = React.useState(defaultValue);
  const [crepeInstance, setCrepeInstance] = React.useState<Crepe | null>(null);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Auto-guardado se activa automáticamente si hay contentId
  const enableAutoSave = !!contentId;

  // Hook de auto-guardado
  const {
    isSaving,
    lastSaveTime,
    scheduleAutoSave,
    saveNow,
    clearScheduledSave,
  } = useAutoSave({
    contentId,
    enabled: enableAutoSave,
    interval: autoSaveInterval,
    onSave: onAutoSave,
    onError: onAutoSaveError,
  });

  // Actualizar el contenido cuando cambie el defaultValue
  useEffect(() => {
    if (defaultValue && defaultValue !== currentContent) {
      setCurrentContent(defaultValue);
    }
  }, [defaultValue]);

  // Configurar auto-guardado cuando cambie el contentId
  useEffect(() => {
    if (contentId) {
      // Configurar el auto-guardado
    }
  }, [contentId]);

  // Manejar cambios en el editor
  const handleContentChange = useCallback(
    (newContent: string) => {
      if (newContent !== currentContent) {
        setCurrentContent(newContent);
        setHasChanges(true);

        // Programar auto-guardado
        if (enableAutoSave && contentId) {
          // El auto-guardado se maneja en el hook useAutoSave
        }
      }
    },
    [currentContent, enableAutoSave, contentId]
  );

  // Configurar el editor cuando esté listo
  const setupEditor = useCallback(async () => {
    if (!crepeInstance) {
      return;
    }

    try {
      // Configurar el editor Milkdown
      const editor = crepeInstance;

      // Configurar el contenido inicial
      if (defaultValue) {
        editor.action(editor.action.replaceAll(defaultValue));
      }

      // Configurar el listener de cambios
      editor.action(
        editor.action.listener((ctx) => {
          const markdown = ctx
            .get(editor.action.editorCtx)
            .state.doc.toString();
          handleContentChange(markdown);
        })
      );
    } catch (error) {
      // Manejar errores de configuración del editor
    }
  }, [crepeInstance, defaultValue, handleContentChange]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearScheduledSave();
    };
  }, [clearScheduledSave]);

  const handleDownload = () => {
    let markdownContent = currentContent;

    // Intentar obtener contenido del editor si está disponible
    if (crepeInstance) {
      try {
        markdownContent = crepeInstance.getMarkdown();
      } catch (error) {
        console.log("Usando contenido actual:", error);
        markdownContent = currentContent;
      }
    }

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Función para guardar manualmente
  const handleManualSave = async () => {
    if (contentId && enableAutoSave) {
      await saveNow(currentContent);
    }
  };

  // Componente del indicador de estado
  const StatusIndicator = () => {
    if (!showStatusIndicator || !enableAutoSave || !contentId) return null;

    return (
      <div className="fixed top-20 right-4 z-50 flex items-center gap-1 px-2 py-1 bg-green-100/80 backdrop-blur-sm border border-green-300/50 rounded-full text-xs shadow-sm">
        {isSaving ? (
          <>
            <div className="animate-spin w-2 h-2 border border-green-600 border-t-transparent rounded-full"></div>
            <span className="text-green-800 font-medium text-[10px]">
              Guardando
            </span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium text-[10px]">
              Auto-guardado
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Indicador de estado siempre en posición fija */}
      <StatusIndicator />

      <Milkdown />

      {/* Botones solo si showButtons está habilitado y statusPosition es bottom */}
      {statusPosition === "bottom" && showButtons && (
        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-2">
            {/* Botón de guardado manual (solo si auto-guardado está habilitado) */}
            {enableAutoSave && contentId && (
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Guardar Ahora
              </button>
            )}

            {/* Botón de descarga */}
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              📥 Descargar Markdown
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Componente principal que envuelve con MilkdownProvider
const MilkdownEditorClient: FC<MilkdownEditorClientProps> = (props) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor {...props} />
    </MilkdownProvider>
  );
};

export default MilkdownEditorClient;
