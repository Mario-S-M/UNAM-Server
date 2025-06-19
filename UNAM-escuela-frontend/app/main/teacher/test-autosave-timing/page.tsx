"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClient = dynamic(
  () => import("@/components/global/milkdown-editor-client"),
  { ssr: false }
);

export default function TestAutoSaveTimingPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TestAutoSaveTimingContent />
    </RouteGuard>
  );
}

function TestAutoSaveTimingContent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [changeCount, setChangeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 1,
    });
    const logEntry = `[${timestamp}] ${message}`;
    setLogs((prev) => [logEntry, ...prev.slice(0, 9)]); // Mantener solo los últimos 10 logs
    console.log(logEntry);
  };

  const testContent = `# ⏰ Prueba de Timing de Auto-Guardado

## Instrucciones de Prueba

1. **Escribe o edita** este contenido
2. **Observa los logs** en tiempo real abajo
3. **Verifica** que se guarde exactamente **5 segundos** después del último cambio

## Contenido de Prueba

Edita este texto para probar:

- Primer punto de prueba
- Segundo punto de prueba
- Tercer punto de prueba

### Tabla de Prueba

| Cambio | Tiempo | Estado |
|--------|--------|--------|
| 1      | --     | Pendiente |
| 2      | --     | Pendiente |

## Notas

- El auto-guardado debería cancelar el anterior si detecta un nuevo cambio
- Solo debería guardar 5 segundos después del ÚLTIMO cambio
- Los logs mostrarán el timing exacto

---
*Edita cualquier parte de este contenido para probar*
`;

  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      setSaveCount((prev) => prev + 1);
      addLog(
        `✅ GUARDADO #${saveCount + 1} exitoso - Contenido: ${
          content.length
        } caracteres`
      );
    } else {
      addLog(`❌ ERROR en guardado - Contenido: ${content.length} caracteres`);
    }
  };

  const handleAutoSaveError = (error: string) => {
    addLog(`🚨 ERROR de auto-guardado: ${error}`);
  };

  React.useEffect(() => {
    addLog("🚀 Iniciando prueba de timing de auto-guardado");
    addLog("📝 Configurado para guardar cada 5 segundos después de cambios");
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            ⏰ Prueba de Timing de Auto-Guardado
          </h1>
          <p className="text-gray-600">
            Verifica que el auto-guardado funcione exactamente como esperado
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {changeCount}
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
              <div className="text-2xl font-bold text-purple-600">5s</div>
              <div className="text-sm text-gray-600">Intervalo de Guardado</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📝 Editor de Prueba</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px]">
                <MilkdownEditorClient
                  defaultValue={testContent}
                  contentId="test-timing-auto-save"
                  autoSaveInterval={5000} // Exactamente 5 segundos
                  onAutoSave={handleAutoSave}
                  onAutoSaveError={handleAutoSaveError}
                  showButtons={false}
                  showStatusIndicator={true}
                  statusPosition="top"
                />
              </div>
            </CardBody>
          </Card>

          {/* Logs en tiempo real */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📊 Logs en Tiempo Real</h2>
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
                            : log.includes("❌") || log.includes("🚨")
                            ? "bg-red-50 border-red-400 text-red-800"
                            : log.includes("🔄")
                            ? "bg-blue-50 border-blue-400 text-blue-800"
                            : log.includes("⏰")
                            ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                            : "bg-gray-50 border-gray-400 text-gray-800"
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

        {/* Instrucciones */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">📋 Cómo Probar</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  ✅ Comportamiento Esperado:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Detecta cambios inmediatamente</li>
                  <li>• Cancela guardado anterior si hay nuevo cambio</li>
                  <li>
                    • Guarda exactamente 5 segundos después del último cambio
                  </li>
                  <li>• Muestra logs con timestamps precisos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">🧪 Pasos de Prueba:</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Escribe algo en el editor</li>
                  <li>
                    2. Sigue escribiendo (debería cancelar guardados anteriores)
                  </li>
                  <li>3. Para de escribir por 5 segundos</li>
                  <li>4. Observa que se guarde exactamente a los 5 segundos</li>
                </ol>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
