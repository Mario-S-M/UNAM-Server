"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-simple.css";

interface MilkdownSimpleProps {
  content?: string;
  onChange?: (content: string) => void;
  readonly?: boolean;
  placeholder?: string;
  className?: string;
}

const MilkdownSimple: React.FC<MilkdownSimpleProps> = ({
  content = "",
  onChange,
  readonly = false,
  placeholder = "Escribe aquí...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onChangeRef = useRef(onChange);

  // Actualizar la referencia del callback
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Función para obtener contenido de forma segura
  const getSafeContent = useCallback(() => {
    if (!crepeRef.current || !isReady) return null;

    try {
      return crepeRef.current.getMarkdown();
    } catch (error) {
      // Si hay error de contexto, simplemente retornamos null
      return null;
    }
  }, [isReady]);

  // Manejar cambios usando eventos del DOM
  const handleContentChange = useCallback(() => {
    if (!readonly && onChangeRef.current && isReady) {
      // Usar setTimeout para asegurar que el cambio se procese
      setTimeout(() => {
        const newContent = getSafeContent();
        if (newContent !== null) {
          onChangeRef.current?.(newContent);
        }
      }, 100);
    }
  }, [readonly, isReady, getSafeContent]);

  useEffect(() => {
    if (!editorRef.current) return;

    const initEditor = async () => {
      try {
        const crepe = new Crepe({
          root: editorRef.current!,
          defaultValue: content,
        });

        crepeRef.current = crepe;
        await crepe.create();

        if (readonly) {
          crepe.setReadonly(true);
        }

        // Marcar como listo después de un delay
        setTimeout(() => {
          setIsReady(true);

          // Configurar event listeners para cambios
          if (!readonly && editorRef.current) {
            const element = editorRef.current;

            element.addEventListener("input", handleContentChange);
            element.addEventListener("keyup", handleContentChange);
            element.addEventListener("paste", handleContentChange);

            // Usar MutationObserver para cambios más complejos
            const observer = new MutationObserver(handleContentChange);
            observer.observe(element, {
              childList: true,
              subtree: true,
              characterData: true,
            });

            return () => {
              element.removeEventListener("input", handleContentChange);
              element.removeEventListener("keyup", handleContentChange);
              element.removeEventListener("paste", handleContentChange);
              observer.disconnect();
            };
          }
        }, 1500); // Delay más largo para asegurar inicialización completa
      } catch (error) {
        console.error("Error al inicializar Milkdown:", error);
      }
    };

    initEditor();

    return () => {
      setIsReady(false);
      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          console.error("Error al destruir editor:", error);
        }
        crepeRef.current = null;
      }
    };
  }, [content, readonly, handleContentChange]);

  return (
    <div
      ref={editorRef}
      className={`milkdown-container milkdown-editor-simple ${
        readonly ? "readonly" : "editable"
      } ${className}`}
    />
  );
};

export default MilkdownSimple;
