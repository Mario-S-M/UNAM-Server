"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";
import { updateContentMarkdown } from "@/app/actions/content-actions";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function TestAutoSaveProfesorPage() {
  return (
    <RouteGuard requiredPage="/main/teacher/test-autosave-profesor">
      <TestAutoSaveProfesorContent />
    </RouteGuard>
  );
}

function TestAutoSaveProfesorContent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [saveCount, setSaveCount] = useState(0);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
    const logEntry = `[${timestamp}] ${message}`;
    setLogs((prev) => [logEntry, ...prev.slice(0, 19)]); // Mantener solo los últimos 20 logs
    
  };

  // Simular la función de guardado del profesor
  const handleSave = async (content: string) => {
    addLog("📝 handleSave llamado desde editor");
    addLog(`📊 Contenido: ${content.length} caracteres`);

    try {
      // Simular el guardado real como lo hace el profesor
      setSaveCount((prev) => prev + 1);
      addLog(`✅ Guardado #${saveCount + 1} simulado exitosamente`);

      // Opcional: hacer un guardado real si tienes un contentId válido
      // const result = await updateContentMarkdown("test-content-id", content);
      // addLog(result.error ? `❌ Error: ${result.error}` : "✅ Guardado real exitoso");

      return Promise.resolve();
    } catch (error) {
      addLog(`❌ Error en guardado: ${error}`);
      throw error;
    }
  };

  React.useEffect(() => {
    addLog("🚀 Iniciando prueba de auto-guardado del profesor");
    addLog("📝 Escribe en el editor para probar el auto-guardado");
  }, []);

  const testContent = `# 🧪 Prueba de Auto-Guardado del Profesor

## Instrucciones

1. **Escribe o edita** este contenido
2. **Observa los logs** en tiempo real a la derecha
3. **Verifica** que el auto-guardado se ejecute correctamente

## Contenido de Prueba

Edita este texto para probar:

- Primer punto de prueba
- Segundo punto de prueba  
- Tercer punto de prueba

### Ejemplo de Código

\`\`\`javascript
// Código de ejemplo
function autoSave() {
  
}
\`\`\`

## Tabla de Prueba

| Edición | Tiempo | Estado |
|---------|--------|--------|
| 1       | --     | Pendiente |
| 2       | --     | Pendiente |

---
*Modifica cualquier parte de este contenido para activar el auto-guardado*
`;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🧪 Prueba de Auto-Guardado del Profesor
          </h1>
          <p className="text-gray-600">
            Verifica que el auto-guardado funcione exactamente como en el
            entorno del profesor
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {logs.filter((log) => log.includes("📝")).length}
              </div>
              <div className="text-sm text-gray-600">Cambios Detectados</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {saveCount}
              </div>
              <div className="text-sm text-gray-600">Guardados Exitosos</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-purple-600">Auto</div>
              <div className="text-sm text-gray-600">Modo de Guardado</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📝 Editor del Profesor</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px]">
                <MilkdownEditorClientFixed
                  defaultValue={testContent}
                  contentId="test-profesor-content"
                  onSave={handleSave}
                />
              </div>
            </CardBody>
          </Card>

          {/* Logs en tiempo real */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📊 Logs del Sistema</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px] overflow-y-auto">
                <div className="space-y-2 font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">
                      Esperando actividad...
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs border-l-4 ${
                          log.includes("✅")
                            ? "bg-green-50 border-green-400 text-green-800"
                            : log.includes("❌")
                            ? "bg-red-50 border-red-400 text-red-800"
                            : log.includes("📝")
                            ? "bg-blue-50 border-blue-400 text-blue-800"
                            : log.includes("🎯")
                            ? "bg-purple-50 border-purple-400 text-purple-800"
                            : "bg-gray-50 border-gray-300 text-gray-700"
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="mt-6">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  ✅ Comportamiento Esperado:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Detecta cambios inmediatamente cuando escribes</li>
                  <li>• Llama a la función onSave automáticamente</li>
                  <li>• Funciona igual que en el editor del profesor</li>
                  <li>• Muestra logs detallados para debugging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">🧪 Pasos de Prueba:</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Escribe algo en el editor</li>
                  <li>2. Observa los logs de cambios detectados</li>
                  <li>3. Verifica que se ejecute la función de guardado</li>
                  <li>4. Comprueba que el contador aumente</li>
                </ol>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
