"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";

export default function TestSimpleAutoSavePage() {
  return (
    <RouteGuard requiredPage="/main/teacher/test-simple-autosave">
      <TestSimpleAutoSaveContent />
    </RouteGuard>
  );
}

function TestSimpleAutoSaveContent() {
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
    setLogs((prev) => [logEntry, ...prev.slice(0, 14)]); // Últimos 15 logs
  };

  // Función de guardado simplificada
  const handleSave = async (content: string) => {
    addLog(`💾 Guardando ${content.length} caracteres...`);

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300));

      setSaveCount((prev) => prev + 1);
      addLog(`✅ Guardado #${saveCount + 1} exitoso`);

      return Promise.resolve();
    } catch (error) {
      addLog(`❌ Error: ${error}`);
      throw error;
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setSaveCount(0);
    addLog("🔄 Logs limpiados");
  };

  React.useEffect(() => {
    addLog("🚀 Editor simple iniciado");
  }, []);

  const testContent = `# 🧪 Prueba de Auto-Guardado Simple

Este es un editor simplificado para probar el auto-guardado.

## Instrucciones

1. **Escribe algo aquí**
2. **Observa los logs**
3. **Verifica que se guarde automáticamente**

## Contenido de Prueba

Puedes editar este texto:

- Lista de prueba
- Otro elemento
- Tercer elemento

### Código de Ejemplo

\`\`\`javascript

\`\`\`

**¡Empieza a escribir para probar el auto-guardado!**
`;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🧪 Prueba de Auto-Guardado Simple
          </h1>
          <p className="text-gray-600">
            Editor simplificado con detección de cambios por polling
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {logs.filter((log) => log.includes("💾")).length}
              </div>
              <div className="text-sm text-gray-600">Intentos de Guardado</div>
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
              <div className="text-2xl font-bold text-purple-600">Simple</div>
              <div className="text-sm text-gray-600">Método de Detección</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card className="min-h-[500px]">
            <CardHeader className="flex justify-between">
              <h2 className="text-xl font-semibold">📝 Editor Simple</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">📝 Editor Removed</p>
                  <p>
                    Simple Milkdown Editor component was removed during cleanup
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Logs */}
          <Card className="min-h-[500px]">
            <CardHeader className="flex justify-between">
              <h2 className="text-xl font-semibold">📊 Logs del Sistema</h2>
              <Button size="sm" variant="flat" onPress={clearLogs}>
                Limpiar
              </Button>
            </CardHeader>
            <CardBody>
              <div className="h-[400px] overflow-y-auto">
                <div className="space-y-1 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">
                      Sin actividad...
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border-l-4 ${
                          log.includes("✅")
                            ? "bg-green-50 border-green-400 text-green-800"
                            : log.includes("❌")
                            ? "bg-red-50 border-red-400 text-red-800"
                            : log.includes("💾")
                            ? "bg-blue-50 border-blue-400 text-blue-800"
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

        {/* Info */}
        <Card className="mt-6">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-green-600">
                  ✅ Características de este Editor:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Detección por polling cada segundo</li>
                  <li>• Auto-guardado cada 2 segundos después de cambios</li>
                  <li>• Manejo simple de errores</li>
                  <li>• Logs detallados para debugging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">
                  🔧 Ventajas del Approach Simple:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Menos propenso a errores de eventos</li>
                  <li>• Más predecible y debuggeable</li>
                  <li>• Funciona independiente de la API del editor</li>
                  <li>• Fácil de mantener y modificar</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
