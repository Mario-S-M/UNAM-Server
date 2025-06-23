"use client";
import React, { useEffect, useRef } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
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

  return (
    <div className="h-full w-full">
      <div className="p-1 max-w-none">
        <Milkdown />
      </div>
    </div>
  );
};

export default MilkdownReadOnlyViewer;
