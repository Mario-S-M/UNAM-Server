"use client";
import React, { useEffect, useRef } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-theme.css";

interface MilkdownReadOnlyViewerProps {
  content: string;
  downloadFileName?: string;
  onReady?: () => void;
}

const MilkdownReadOnlyViewer: FC<MilkdownReadOnlyViewerProps> = ({
  content,
  downloadFileName = "content.md",
  onReady,
}) => {
  const [editor, setEditor] = React.useState<Crepe | null>(null);
  const onReadyRef = useRef(onReady);

  // Actualizar la referencia cuando cambie la prop
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEditor(
    (root) => {
      const crepe = new Crepe({
        root,
        defaultValue: content,
      });

      setEditor(crepe);

      // Configurar el editor como solo lectura después de que se cree
      crepe.create().then(() => {
        crepe.setReadonly(true);

        // Llamar onReady cuando el editor esté listo
        if (onReadyRef.current) {
          onReadyRef.current();
        }
      });

      return crepe;
    },
    [content]
  );

  const handleDownload = () => {
    if (editor) {
      const markdownContent = editor.getMarkdown();
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Milkdown />
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          📥 Download Markdown
        </button>
      </div>
    </div>
  );
};

export default MilkdownReadOnlyViewer;
