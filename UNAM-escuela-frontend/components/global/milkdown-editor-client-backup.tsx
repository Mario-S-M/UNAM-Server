"use client";
import React from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
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

// Componente interno del editor que usa useEditor
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
  const [editorInstance, setEditorInstance] = React.useState<any>(null);

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

  const { get } = useEditor(
    (root) => {
      console.log(
        "🔧 Inicializando editor con contenido:",
        defaultValue.substring(0, 50) + "..."
      );

      return Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, defaultValue);

          // Configurar listener para cambios de contenido
          ctx
            .get(listenerCtx)
            .markdownUpdated((ctx, markdown, prevMarkdown) => {
              if (markdown !== prevMarkdown && markdown.trim() !== "") {
                setCurrentContent(markdown);
                if (enableAutoSave && contentId) {
                  scheduleAutoSave(markdown);
                }
              }
            });
        })
        .use(commonmark)
        .use(listener)
        .use(placeholderPlugin);
    },
    [defaultValue] // Dependencias para recrear el editor cuando cambie el valor por defecto
  );

  // Obtener instancia del editor cuando esté listo
  React.useEffect(() => {
    const editor = get();
    if (editor) {
      setEditorInstance(editor);
    }
  }, [get]);

  // Cleanup al desmontar
  React.useEffect(() => {
    return () => {
      clearScheduledSave();
    };
  }, [clearScheduledSave]);

  const handleDownload = () => {
    let markdownContent = currentContent;

    // Intentar obtener contenido del editor si está disponible
    if (editorInstance) {
      try {
        // Usar la API del editor para obtener el markdown
        const ctx = editorInstance.ctx;
        if (ctx) {
          markdownContent = ctx.get(defaultValueCtx) || currentContent;
        }
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
