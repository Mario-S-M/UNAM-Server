"use client";
import React, { useEffect } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-theme-basic.css";
import "./milkdown-theme-icons.css";

interface EditorWithChangesProps {
  defaultValue: string;
  onChange?: (content: string) => void;
  onReady?: () => void;
}

const EditorWithChanges: React.FC<EditorWithChangesProps> = ({
  defaultValue,
  onChange,
  onReady,
}) => {
  const [editor, setEditor] = React.useState<Crepe | null>(null);

  useEditor(
    (root) => {
      const crepe = new Crepe({
        root,
        defaultValue,
      });
      setEditor(crepe);

      // Notificar que el editor está listo
      if (onReady) {
        setTimeout(() => {
          onReady();
        }, 100);
      }

      return crepe;
    },
    [defaultValue]
  );

  // Configurar el listener para cambios en el contenido
  useEffect(() => {
    if (!editor || !onChange) return;

    const timer = setInterval(() => {
      const content = editor.getMarkdown();
      onChange(content);
    }, 1000); // Verificar cada segundo por cambios

    return () => {
      clearInterval(timer);
    };
  }, [editor, onChange]);

  return <Milkdown />;
};

export default EditorWithChanges;
