"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react";
import { BookOpen, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClient = dynamic(
  () => import("@/components/global/milkdown-editor-client"),
  { ssr: false }
);

export default function TeacherAutoSaveTestPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TeacherAutoSaveTestContent />
    </RouteGuard>
  );
}

function TeacherAutoSaveTestContent() {
  const [testResults, setTestResults] = useState<Record<string, boolean | string>>({});

  // Contenido de prueba
  const testContent = `# Prueba de Auto-Guardado para Profesores

## Instrucciones de Prueba

1. **Edita este contenido** - Realiza algunos cambios en el texto
2. **Observa los indicadores** - Verifica que aparezcan los estados de guardado
3. **Espera 5 segundos** - El auto-guardado debería activarse automáticamente
4. **Verifica el guardado** - Deberías ver una confirmación verde

## Contenido de Ejemplo

Este es contenido educativo de ejemplo que puedes editar.

### Objetivos de Aprendizaje
- [ ] Verificar que el auto-guardado funciona
- [ ] Confirmar los indicadores visuales
- [ ] Probar la funcionalidad de guardado manual

### Material de Estudio
Aquí puedes agregar material educativo...

---
*Última edición: ${new Date().toLocaleString()}*
`;

  const mockContentId = "test-content-123"; // ID de prueba

  const handleAutoSave = (success: boolean, content: string) => {
    console.log("Auto-save callback:", {
      success,
      contentLength: content.length,
    });
    setTestResults((prev) => ({
      ...prev,
      autoSave: success,
    }));
  };

  const handleAutoSaveError = (error: string) => {
    console.error("Auto-save error:", error);
    setTestResults((prev) => ({
      ...prev,
      autoSave: false,
      error: error,
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                🧪 Prueba de Auto-Guardado para Profesores
              </h1>
              <p className="text-gray-600">
                Página de prueba para verificar que el auto-guardado funciona
                correctamente para profesores
              </p>
            </div>
            <Link href="/main/teacher">
              <Button color="default" variant="light">
                ← Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Test Status */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Estado de las Pruebas</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                {testResults.autoSave === true ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : testResults.autoSave === false ? (
                  <div className="w-5 h-5 bg-red-500 rounded-full" />
                ) : (
                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                )}
                <span>Auto-guardado</span>
              </div>

              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-500" />
                <span>Editor funcionando</span>
              </div>

              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <span>Contenido cargado</span>
              </div>
            </div>

            {testResults.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Error: {testResults.error}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              📋 Instrucciones de Prueba
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Edita el contenido</p>
                  <p className="text-sm text-gray-600">
                    Realiza cambios en el editor de abajo. Agrega texto,
                    modifica listas, etc.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Observa los indicadores</p>
                  <p className="text-sm text-gray-600">
                    Deberías ver indicadores de estado en la parte inferior del
                    editor
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Espera el auto-guardado</p>
                  <p className="text-sm text-gray-600">
                    Después de 5 segundos sin editar, debería guardarse
                    automáticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Verifica el guardado</p>
                  <p className="text-sm text-gray-600">
                    Deberías ver una confirmación verde y el estado de prueba de
                    arriba debería cambiar
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Editor Test */}
        <Card className="min-h-[600px]">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              📝 Editor de Prueba con Auto-Guardado
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[600px]">
              <MilkdownEditorClient
                defaultValue={testContent}
                contentId={mockContentId}
                autoSaveInterval={5000}
                downloadFileName="teacher-test-content.md"
                onAutoSave={handleAutoSave}
                onAutoSaveError={handleAutoSaveError}
              />
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">ℹ️ Información Técnica</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Auto-guardado:</strong> Cada 5 segundos después de
              cambios
            </li>
            <li>
              • <strong>Indicadores:</strong> 🟠 Esperando, 🔵 Guardando, 🟢
              Guardado, 🔴 Error
            </li>
            <li>
              • <strong>API:</strong> Conectado a updateContentMarkdown action
            </li>
            <li>
              • <strong>Contenido ID:</strong> {mockContentId}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
