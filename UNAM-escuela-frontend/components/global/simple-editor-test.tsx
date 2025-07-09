// Simple test component for Milkdown editor
"use client";

import React from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "../app/milkdown-custom-theme.css";

interface SimpleEditorProps {
  defaultValue?: string;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  defaultValue = "# Hola!\n\nEste es un editor de prueba. Puedes **editar** este texto.\n\n- Item 1\n- Item 2\n\n> Cita de ejemplo",
}) => {
  const [content, setContent] = React.useState(defaultValue);

  useEditor(
    (root) => {
      const crepe = new Crepe({
        root,
        defaultValue,
      });

      crepe.create().then(() => {
        console.log("Editor creado exitosamente");

        // Intentar obtener el contenido actual
        try {
          const currentContent = crepe.getMarkdown();
          console.log("Contenido actual:", currentContent);
          setContent(currentContent);
        } catch (error) {
          console.log("Error al obtener contenido:", error);
        }
      });

      return crepe;
    },
    [defaultValue]
  );

  return (
    <div className="milkdown-editor h-full w-full p-4 border border-gray-300 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Editor de Prueba</h3>
        <p className="text-sm text-gray-600">
          Longitud del contenido: {content.length} caracteres
        </p>
      </div>

      <div className="h-96 w-full relative border border-gray-200 rounded">
        <Milkdown />
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Contenido actual:</h4>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
};

const SimpleEditorTest: React.FC<SimpleEditorProps> = (props) => {
  return (
    <MilkdownProvider>
      <SimpleEditor {...props} />
    </MilkdownProvider>
  );
};

export default SimpleEditorTest;
