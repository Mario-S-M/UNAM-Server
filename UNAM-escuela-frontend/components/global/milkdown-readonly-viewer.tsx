"use client";
import React, { useEffect, useRef } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "../../app/milkdown-custom-theme.css";

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
    <div
      className="milkdown-readonly h-full w-full flex justify-center"
      style={{ padding: 0, margin: 0 }}
    >
      <div className="w-full max-w-none" style={{ padding: 0, margin: 0 }}>
        <Milkdown />
      </div>
    </div>
  );
};

export default MilkdownReadOnlyViewer;
