"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClient = dynamic(
  () => import("@/components/global/milkdown-editor-client"),
  { ssr: false }
);

export default function TestContentLoadPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TestContentLoadContent />
    </RouteGuard>
  );
}

function TestContentLoadContent() {
  // Contenido de prueba que sabemos que existe
  const testContent = `# noooooooo

## Contenido Adicional de Prueba

Este es contenido adicional para verificar que el editor está funcionando correctamente.

### Lista de Elementos

- Item 1
- Item 2
- Item 3

### Código de Ejemplo

\`\`\`javascript
console.log("Hello World!");
\`\`\`

### Tabla

| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |

## Final

Este es el final del contenido de prueba.
`;

  const handleAutoSave = (success: boolean, content: string) => {
    console.log(
      `🔄 Auto-guardado ${success ? "exitoso" : "falló"}:`,
      content.substring(0, 50) + "..."
    );
  };

  const handleAutoSaveError = (error: string) => {
    console.error("❌ Error en auto-guardado:", error);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Prueba de Carga de Contenido
          </h1>
          <p className="text-gray-600">
            Esta página prueba que el editor puede cargar y mostrar contenido
            correctamente.
          </p>
        </div>

        {/* Editor de Prueba */}
        <Card className="min-h-[600px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Editor de Prueba</h2>
              <div className="text-sm text-gray-600">
                Contenido: Verb "To Be"
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-[600px]">
              <MilkdownEditorClient
                defaultValue={testContent}
                contentId="2c2a1f95-a61e-4644-89a1-09a09ce7c97a" // ID de prueba
                autoSaveInterval={5000}
                onAutoSave={handleAutoSave}
                onAutoSaveError={handleAutoSaveError}
                showButtons={false}
                showStatusIndicator={true}
                statusPosition="top"
              />
            </div>
          </CardBody>
        </Card>

        {/* Información de Depuración */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Información de Depuración
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              • <strong>Contenido original:</strong> "# noooooooo"
            </li>
            <li>
              • <strong>Archivo:</strong>{" "}
              /Markdown/ingl-s/a1/verb-to-be/verb-to-be.md
            </li>
            <li>
              • <strong>Auto-guardado:</strong> Habilitado cada 5 segundos
            </li>
            <li>
              • <strong>Botones:</strong> Ocultos
            </li>
            <li>
              • <strong>Indicador:</strong> Superior, pequeño, verde
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
