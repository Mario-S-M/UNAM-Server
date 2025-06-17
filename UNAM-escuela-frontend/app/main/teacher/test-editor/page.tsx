"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClient = dynamic(
  () => import("@/components/global/milkdown-editor-client"),
  { ssr: false }
);

export default function TestTeacherEditorPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TestTeacherEditorContent />
    </RouteGuard>
  );
}

function TestTeacherEditorContent() {
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<string>("");

  // ID de prueba - este sería el ID real del contenido del profesor
  const testContentId = "2c2a1f95-a61e-4644-89a1-09a09ce7c97a";

  const testContent = `# Prueba de Editor para Profesor

## Descripción

¡Hola! Este es un editor de prueba para verificar que el auto-guardado funcione correctamente.

## Instrucciones de Prueba

1. **Edita este contenido** - Modifica cualquier parte del texto
2. **Observa el indicador verde** en la parte superior
3. **Espera 5 segundos** después de hacer cambios
4. **Verifica que se guarde** automáticamente

## Contenido de Ejemplo

Este es contenido que puedes editar libremente para probar el auto-guardado.

### Lista de Tareas
- [ ] Modificar este texto
- [ ] Agregar contenido nuevo
- [ ] Verificar que se guarde automáticamente

### Notas Importantes
- El auto-guardado se activa 5 segundos después del último cambio
- El indicador verde muestra el estado del auto-guardado
- No necesitas hacer nada manualmente, se guarda solo

---
*Última edición: ${new Date().toLocaleString()}*
`;

  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      setAutoSaveStatus("✅ ¡Contenido guardado exitosamente!");
      console.log("✅ Auto-guardado exitoso!");
    } else {
      setAutoSaveStatus("❌ Error al guardar el contenido");
      console.log("❌ Error en auto-guardado");
    }
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setAutoSaveStatus(""), 3000);
  };

  const handleAutoSaveError = (error: string) => {
    setAutoSaveStatus(`🚨 Error: ${error}`);
    setTimeout(() => setAutoSaveStatus(""), 5000);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                🧪 Prueba de Editor para Profesor
              </h1>
              <p className="text-gray-600">
                Editor con auto-guardado activado - Guarda cada 5 segundos
                después de detectar cambios
              </p>
            </div>
            <Link href="/main/teacher">
              <Button
                color="default"
                variant="light"
                startContent={<ArrowLeft className="h-4 w-4" />}
              >
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Message */}
        {autoSaveStatus && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              {autoSaveStatus}
            </p>
          </div>
        )}

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              📋 ¿Cómo probar el auto-guardado?
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Edita el contenido</p>
                    <p className="text-sm text-gray-600">
                      Modifica cualquier texto en el editor de abajo
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Observa el indicador verde</p>
                    <p className="text-sm text-gray-600">
                      Verás el estado del auto-guardado en la parte superior del
                      editor
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Espera 5 segundos</p>
                    <p className="text-sm text-gray-600">
                      Después de tu último cambio, espera y verás que se guarda
                      automáticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Verifica el guardado</p>
                    <p className="text-sm text-gray-600">
                      Deberías ver una confirmación verde arriba
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Editor */}
        <Card className="min-h-[600px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">
                📝 Editor con Auto-Guardado
              </h2>
              <div className="text-sm text-gray-600">
                Content ID:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {testContentId}
                </code>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-[600px]">
              <MilkdownEditorClient
                defaultValue={testContent}
                contentId={testContentId}
                autoSaveInterval={5000} // 5 segundos
                onAutoSave={handleAutoSave}
                onAutoSaveError={handleAutoSaveError}
                showButtons={false} // Sin botones de guardar/descargar
                showStatusIndicator={true}
                statusPosition="top" // Indicador verde arriba
              />
            </div>
          </CardBody>
        </Card>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">ℹ️ Información Técnica</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Auto-guardado:</strong> Se activa exactamente 5 segundos
              después del último cambio
            </li>
            <li>
              • <strong>Detección de cambios:</strong> Usa el listener de
              Milkdown para detectar modificaciones
            </li>
            <li>
              • <strong>API:</strong> Guarda usando la mutación GraphQL
              updateContentMarkdown
            </li>
            <li>
              • <strong>Indicador verde:</strong> Siempre visible en la parte
              superior cuando el auto-guardado está activo
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
