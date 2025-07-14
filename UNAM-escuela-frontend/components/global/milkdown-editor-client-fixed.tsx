"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-simple.css";

interface MilkdownEditorClientProps {
  defaultValue: string;
  downloadFileName?: string;
  contentId?: string;
  onSave?: (content: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  className?: string;
}

const MilkdownEditorClientFixed: FC<MilkdownEditorClientProps> = ({
  defaultValue,
  downloadFileName = "content.md",
  contentId,
  onSave,
  readonly = false,
  placeholder = "Escribe aquí...",
  className = "",
}) => {
  console.log("🔄 COMPONENTE MILKDOWN SE ESTÁ MONTANDO", {
    contentId,
    readonly,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const [currentContent, setCurrentContent] = useState(defaultValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializationRef = useRef<boolean>(false);

  // Función para obtener contenido de forma segura sin causar errores de contexto
  const getSafeMarkdown = useCallback(() => {
    // Si el editor no está listo, devolver el contenido actual
    if (!crepeRef.current || !isEditorReady) {
      return currentContent;
    }

    try {
      // Intentar obtener markdown solo si el editor está completamente inicializado
      const markdown = crepeRef.current.getMarkdown();
      return markdown;
    } catch (error) {
      // Si hay cualquier error de contexto, usar fallbacks seguros
      console.debug("Editor context not ready, using fallback content");

      // Fallback 1: Intentar obtener contenido desde el DOM
      try {
        if (editorRef.current) {
          const editorContent = editorRef.current.querySelector(".ProseMirror");
          if (editorContent) {
            const textContent =
              editorContent.textContent ||
              (editorContent as HTMLElement).innerText;
            if (textContent && textContent.trim() !== "") {
              return textContent;
            }
          }
        }
      } catch (domError) {
        console.debug("DOM fallback failed");
      }

      // Fallback 2: Devolver el contenido actual que tenemos guardado
      return currentContent;
    }
  }, [isEditorReady, currentContent]);

  // Manejar cambios usando eventos del DOM con debounce
  const handleEditorChange = useCallback(() => {
    if (!readonly && isEditorReady) {
      // Cancelar timeout previo
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Programar nueva verificación de cambios con debounce
      debounceTimeoutRef.current = setTimeout(() => {
        const newContent = getSafeMarkdown();
        if (
          newContent !== currentContent &&
          newContent.trim() !== "" &&
          newContent !== defaultValue
        ) {
          console.log("📝 Contenido cambió, longitud:", newContent.length);
          setCurrentContent(newContent);

          // Llamar onSave solo si hay cambios significativos
          if (onSave) {
            onSave(newContent).catch((error) => {
              console.error("Error en auto-save:", error);
            });
          }
        }
      }, 2000); // 2 segundos de debounce para evitar llamadas excesivas
    }
  }, [
    readonly,
    isEditorReady,
    getSafeMarkdown,
    currentContent,
    onSave,
    defaultValue,
  ]);

  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (!editorRef.current || initializationRef.current) return;

    const initEditor = async () => {
      try {
        // Marcar como en proceso de inicialización
        initializationRef.current = true;

        console.log("🚀 Iniciando editor Milkdown...");

        // Limpiar editor anterior si existe
        if (crepeRef.current) {
          try {
            crepeRef.current.destroy();
          } catch (e) {
            console.debug("Cleanup previo completado");
          }
        }

        // Limpiar el DOM del container completamente
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }

        // Esperar antes de crear el nuevo editor
        await new Promise((resolve) => setTimeout(resolve, 300));

        const crepe = new Crepe({
          root: editorRef.current!,
          defaultValue: defaultValue,
        });

        crepeRef.current = crepe;

        // Crear el editor y esperar a que esté listo
        await crepe.create();

        if (readonly) {
          crepe.setReadonly(true);
        }

        // Marcar como completamente inicializado
        setHasBeenInitialized(true);

        // Esperar para asegurar que el editor esté completamente inicializado
        setTimeout(() => {
          setIsEditorReady(true);
          console.log("✅ Editor Milkdown inicializado ÚNICA VEZ");

          // Configurar event listeners para detectar cambios
          if (!readonly && editorRef.current) {
            const editorElement = editorRef.current;

            // Agregar listeners para diferentes tipos de eventos
            const changeHandler = () => handleEditorChange();

            editorElement.addEventListener("input", changeHandler);
            editorElement.addEventListener("keyup", changeHandler);
            editorElement.addEventListener("paste", changeHandler);
            editorElement.addEventListener("cut", changeHandler);

            // Usar MutationObserver para cambios más complejos
            const observer = new MutationObserver(changeHandler);
            observer.observe(editorElement, {
              childList: true,
              subtree: true,
              characterData: true,
              attributes: true,
            });

            // Función de limpieza
            return () => {
              editorElement.removeEventListener("input", changeHandler);
              editorElement.removeEventListener("keyup", changeHandler);
              editorElement.removeEventListener("paste", changeHandler);
              editorElement.removeEventListener("cut", changeHandler);
              observer.disconnect();
            };
          }
        }, 1500); // Delay optimizado
      } catch (error) {
        console.error("❌ Error al inicializar Milkdown:", error);
        setIsEditorReady(false);
        initializationRef.current = false; // Permitir retry en caso de error
      }
    };

    initEditor();

    return () => {
      console.log("🧹 Limpiando editor...");
      setIsEditorReady(false);
      setHasBeenInitialized(false);

      // Limpiar timeout de debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          console.debug("Error al destruir editor:", error);
        }
        crepeRef.current = null;
      }

      // Reset de la bandera de inicialización
      initializationRef.current = false;
    };
  }, []); // ¡IMPORTANTE! Sin dependencias para evitar re-inicializaciones

  return (
    <div className={`milkdown-client-container ${className}`}>
      <div
        ref={editorRef}
        className={`milkdown-container milkdown-editor-simple ${
          readonly ? "readonly" : "editable"
        }`}
      />

      {!isEditorReady && (
        <div className="text-sm text-gray-500 mt-2">
          {hasBeenInitialized
            ? "Configurando editor..."
            : "Inicializando editor..."}
        </div>
      )}
    </div>
  );
};

const MilkdownEditorClientFixedMemo = memo(MilkdownEditorClientFixed);

export default MilkdownEditorClientFixedMemo;
