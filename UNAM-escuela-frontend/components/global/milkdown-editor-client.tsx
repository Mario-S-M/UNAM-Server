"use client";
import React, { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { CrepeFeature } from "@milkdown/crepe";
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

// Componente interno del editor que usa Crepe correctamente
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
  const [hasChanges, setHasChanges] = React.useState(false);
  const [editorReady, setEditorReady] = React.useState(false);
  const [editorError, setEditorError] = React.useState<string | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const defaultValueRef = useRef(defaultValue);

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

  // Usar refs para evitar re-renderizados innecesarios
  const currentContentRef = useRef(defaultValue);
  const enableAutoSaveRef = useRef(enableAutoSave);
  const contentIdRef = useRef(contentId);
  const scheduleAutoSaveRef = useRef(scheduleAutoSave);

  // Actualizar refs cuando cambien las props
  React.useEffect(() => {
    currentContentRef.current = currentContent;
    enableAutoSaveRef.current = enableAutoSave;
    contentIdRef.current = contentId;
    scheduleAutoSaveRef.current = scheduleAutoSave;
  }, [currentContent, enableAutoSave, contentId, scheduleAutoSave]);

  // Manejar cambios en el editor - función estable que no cambia
  const handleContentChange = React.useCallback(
    (newContent: string) => {
      const current = currentContentRef.current;
      if (newContent !== current) {
        setCurrentContent(newContent);
        setHasChanges(true);
        currentContentRef.current = newContent;

        // Programar auto-guardado si está habilitado
        if (enableAutoSaveRef.current && contentIdRef.current) {
          scheduleAutoSaveRef.current(newContent);
        }
      }
    },
    [] // Sin dependencias para evitar re-renderizados
  );

  // Inicializar el editor Crepe
  useEffect(() => {
    if (!editorRef.current || isInitialized) return; // Evitar reinicialización si ya está inicializado

    let crepe: Crepe | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const initEditor = async () => {
      try {
        console.log("🚀 Inicializando editor Crepe...");
        setEditorError(null);
        setEditorReady(false);

        // Asegurarse de que el DOM esté listo
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!editorRef.current) {
          throw new Error("Editor ref no disponible");
        }

        // Limpiar el contenido anterior si existe
        editorRef.current.innerHTML = "";

        // Crear instancia de Crepe con configuración básica
        crepe = new Crepe({
          root: editorRef.current,
          defaultValue: defaultValueRef.current || "",
        });

        // Guardar referencia
        crepeRef.current = crepe;

        // Crear el editor y esperar a que esté listo
        await crepe.create();

        console.log("✅ Editor Crepe inicializado correctamente");
        setEditorReady(true);
        setIsInitialized(true);

        // Esperar un poco más para asegurar que el editor esté completamente listo
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Configurar listener de cambios después de que el editor esté completamente inicializado
        intervalId = setInterval(() => {
          if (crepeRef.current) {
            try {
              const markdown = crepeRef.current.getMarkdown();
              if (markdown && markdown !== currentContentRef.current) {
                handleContentChange(markdown);
              }
            } catch (error) {
              // Ignorar errores de obtención de markdown durante la inicialización
            }
          }
        }, 1000);
      } catch (error) {
        console.error("❌ Error al inicializar el editor:", error);
        setEditorError(
          error instanceof Error ? error.message : "Error desconocido"
        );
        setEditorReady(false);
        setIsInitialized(false);
      }
    };

    // Solo inicializar si no hay error
    if (!editorError) {
      initEditor();
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (crepe) {
        try {
          crepe.destroy();
        } catch (error) {
          console.log("Error al destruir el editor:", error);
        }
      }
      crepeRef.current = null;
    };
  }, []); // Sin dependencias para evitar re-inicialización

  // Manejar cambios en defaultValue sin reinicializar el editor
  useEffect(() => {
    if (
      defaultValue !== defaultValueRef.current &&
      crepeRef.current &&
      editorReady
    ) {
      try {
        // Actualizar el contenido del editor sin reinicializarlo
        const currentMarkdown = crepeRef.current.getMarkdown();
        if (currentMarkdown !== defaultValue) {
          // Solo actualizar si realmente es diferente
          defaultValueRef.current = defaultValue;
          setCurrentContent(defaultValue);
          currentContentRef.current = defaultValue;
        }
      } catch (error) {
        console.log("Error al actualizar contenido del editor:", error);
      }
    }
  }, [defaultValue, editorReady]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearScheduledSave();
    };
  }, [clearScheduledSave]);

  const handleDownload = () => {
    let markdownContent = currentContent;

    // Intentar obtener contenido del editor si está disponible
    if (crepeRef.current) {
      try {
        markdownContent = crepeRef.current.getMarkdown();
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
    <div className="milkdown-editor h-full w-full relative">
      {/* Indicador de estado siempre en posición fija */}
      <StatusIndicator />

      <div className="h-full w-full relative" style={{ minHeight: "400px" }}>
        {/* Mostrar error si existe */}
        {editorError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center p-4">
              <div className="text-red-600 font-medium mb-2">
                Error al cargar el editor
              </div>
              <div className="text-red-500 text-sm mb-3">{editorError}</div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setEditorError(null);
                    setIsInitialized(false);
                    setEditorReady(false);
                    // Forzar reinicialización después de un pequeño delay
                    setTimeout(() => {
                      const event = new Event("retry-init");
                      editorRef.current?.dispatchEvent(event);
                    }, 100);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => {
                    setEditorError(null);
                    // Usar textarea como fallback
                    const textarea = document.createElement("textarea");
                    textarea.value = currentContent || defaultValue;
                    textarea.className =
                      "w-full h-full p-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500";
                    textarea.placeholder =
                      "Escriba su contenido markdown aquí...";
                    textarea.addEventListener("input", (e) => {
                      const target = e.target as HTMLTextAreaElement;
                      handleContentChange(target.value);
                    });

                    if (editorRef.current) {
                      editorRef.current.innerHTML = "";
                      editorRef.current.appendChild(textarea);
                      setEditorReady(true);
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Usar Editor Simple
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar loading si no está listo y no hay error */}
        {!editorReady && !editorError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center p-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-gray-600">Cargando editor...</div>
            </div>
          </div>
        )}

        {/* Container del editor */}
        <div
          ref={editorRef}
          className={`absolute inset-0 overflow-hidden ${
            !editorReady ? "opacity-0" : "opacity-100"
          }`}
          style={{
            minHeight: "400px",
            height: "100%",
            width: "100%",
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

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
    </div>
  );
};

// Componente principal exportado directamente
const MilkdownEditorClient: FC<MilkdownEditorClientProps> = (props) => {
  return <MilkdownEditor {...props} />;
};

export default MilkdownEditorClient;
