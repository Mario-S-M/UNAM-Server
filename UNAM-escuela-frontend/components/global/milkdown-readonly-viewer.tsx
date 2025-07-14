"use client";
import React, { useEffect, useRef } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

interface MilkdownReadOnlyViewerProps {
  content: string;
  onReady?: () => void;
}

const MilkdownReadOnlyViewer: FC<MilkdownReadOnlyViewerProps> = ({
  content,
  onReady,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

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

        // Configurar como readonly
        crepe.setReadonly(true);

        // Llamar onReady si está definido
        if (onReady) {
          onReady();
        }
      } catch (error) {
        
      }
    };

    initEditor();

    return () => {
      if (crepeRef.current) {
        try {
          crepeRef.current.destroy();
        } catch (error) {
          
        }
        crepeRef.current = null;
      }
    };
  }, [content, onReady]);

  return <div ref={editorRef} className="milkdown-readonly-viewer" />;
};

export default MilkdownReadOnlyViewer;
