"use client";
import React from "react";
import type { FC } from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-theme-basic.css";
import "./milkdown-theme-icons.css"; // Estilos específicos para iconos
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

const MilkdownEditorClient: FC<MilkdownEditorClientProps> = ({
  defaultValue,
  downloadFileName = "content.md",
  contentId,
  autoSaveInterval = 5000, // 5 segundos por defecto
  onAutoSave,
  onAutoSaveError,
  showButtons = true,
  showStatusIndicator = true,
  statusPosition = "bottom",
}) => {
  const [editor, setEditor] = React.useState<Crepe | null>(null);
  const [currentContent, setCurrentContent] = React.useState(defaultValue);

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

  // Actualizar currentContent cuando cambie defaultValue
  React.useEffect(() => {
    if (defaultValue !== currentContent) {
      console.log("📝 Actualizando currentContent con nuevo defaultValue");
      setCurrentContent(defaultValue);
    }
  }, [defaultValue]);

  useEditor(
    (root) => {
      console.log(
        "🔧 Inicializando editor con contenido:",
        defaultValue.substring(0, 50) + "..."
      );

      // Usar Crepe con configuración específica para mostrar toolbar solo en selección de texto
      const crepe = new Crepe({
        root,
        defaultValue,
        // Features habilitadas explícitamente, sin personalización adicional
        // La configuración del toolbar está en milkdown-theme-basic.css
        // que asegura que el toolbar solo aparezca en selección de texto
      });

      setEditor(crepe);
      setCurrentContent(defaultValue);

      // Solo configurar auto-save si está habilitado
      if (enableAutoSave && contentId) {
        console.log("🔄 Configurando auto-guardado básico para:", contentId);

        // Usar un polling simple para detectar cambios
        setTimeout(() => {
          let lastCheckedContent = defaultValue;

          const interval = setInterval(() => {
            try {
              const newContent = crepe.getMarkdown();

              if (
                newContent !== lastCheckedContent &&
                newContent.trim() !== ""
              ) {
                lastCheckedContent = newContent;
                setCurrentContent(newContent);
                scheduleAutoSave(newContent);
              }
            } catch (error) {
              console.error("Error obteniendo contenido:", error);
            }
          }, 1000); // Verificar cada segundo

          // Cleanup
          setTimeout(() => {
            clearInterval(interval);
          }, 30 * 60 * 1000);
        }, 2000);
      }

      return crepe;
    },
    [] // Sin dependencias para evitar recrear el editor constantemente
  );

  // Cleanup al desmontar
  React.useEffect(() => {
    return () => {
      clearScheduledSave();
    };
  }, [clearScheduledSave]);

  const handleDownload = () => {
    let markdownContent = currentContent;

    // Intentar obtener contenido del editor si está disponible
    if (editor) {
      try {
        markdownContent = editor.getMarkdown();
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
        <div className="flex justify-end items-center mt-4">
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

export default MilkdownEditorClient;
