"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";
import { useSubtleAutoSave } from "@/app/hooks/use-subtle-auto-save";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function TestAutoSaveDebugPage() {
  return (
    <RouteGuard requiredPage="/main/teacher/test-autosave-debug">
      <TestAutoSaveDebugContent />
    </RouteGuard>
  );
}

function TestAutoSaveDebugContent() {
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
    setLogs((prev) => [logEntry, ...prev.slice(0, 19)]); // Mantener solo los últimos 20 logs
    
  };

  // Hook de auto-save para testing con ID de prueba
  const autoSave = useSubtleAutoSave({
    contentId: "test-content-debug", // ID especial para modo prueba
    enabled: true,
    interval: 2000, // 2 segundos para testing
  });

  React.useEffect(() => {
    addLog("🚀 Iniciando prueba de auto-guardado mejorado");
    addLog("📝 Configurado para guardar cada 2 segundos después de cambios");
    addLog("💡 Este test usa el hook 'useSubtleAutoSave' mejorado");
  }, []);

  const handleEditorChange = React.useCallback(
    async (content: string) => {
      setChangeCount((prev) => prev + 1);
      addLog(
        `📝 Cambio #${changeCount + 1} detectado - Longitud: ${
          content.length
        } caracteres`
      );

      // Programar auto-save
      autoSave.scheduleAutoSave(content);
      addLog(`⏰ Auto-save programado para ejecutarse en 2 segundos`);
    },
    [autoSave, changeCount]
  );

  // Monitor del estado del auto-save
  React.useEffect(() => {
    if (autoSave.isSaving) {
      addLog(`💾 GUARDANDO... (Estado: activo)`);
    }
  }, [autoSave.isSaving]);

  React.useEffect(() => {
    if (autoSave.lastSaveTime) {
      setSaveCount((prev) => prev + 1);
      addLog(
        `✅ GUARDADO EXITOSO #${
          saveCount + 1
        } - ${autoSave.lastSaveTime.toLocaleTimeString()}`
      );
    }
  }, [autoSave.lastSaveTime, saveCount]);

  const testContent = `# 🧪 Prueba de Auto-Guardado Mejorado

## Instrucciones de Prueba

1. **Escribe o edita** este contenido
2. **Observa los logs** en tiempo real abajo  
3. **Verifica** que se guarde exactamente **2 segundos** después del último cambio

## Características del Nuevo Sistema

- ✅ Auto-guardado sutil y transparente
- ✅ Sin interrupciones al usuario
- ✅ Mejor manejo de errores
- ✅ Logging detallado para debugging
- ✅ Estados visuales sutiles

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

## Notas Técnicas

- El auto-guardado usa \`useSubtleAutoSave\` 
- Los cambios se detectan en tiempo real
- Solo guarda si hay cambios reales
- Los logs muestran el timing exacto
- El guardado es completamente silencioso para el usuario

---
*Edita cualquier parte de este contenido para probar el sistema mejorado*
`;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🧪 Debug de Auto-Guardado Mejorado
          </h1>
          <p className="text-gray-600">
            Sistema mejorado con guardado sutil y transparente
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-purple-600">2s</div>
              <div className="text-sm text-gray-600">Intervalo de Guardado</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  autoSave.isSaving ? "text-orange-600" : "text-gray-600"
                }`}
              >
                {autoSave.isSaving ? "💾" : "⏸️"}
              </div>
              <div className="text-sm text-gray-600">
                {autoSave.isSaving ? "Guardando" : "En espera"}
              </div>
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
                <MilkdownEditorClientFixed
                  defaultValue={testContent}
                  onSave={handleEditorChange}
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
                            : log.includes("❌")
                            ? "bg-red-50 border-red-400 text-red-800"
                            : log.includes("💾")
                            ? "bg-blue-50 border-blue-400 text-blue-800"
                            : log.includes("📝")
                            ? "bg-purple-50 border-purple-400 text-purple-800"
                            : log.includes("⏰")
                            ? "bg-orange-50 border-orange-400 text-orange-800"
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

        {/* Información del Estado Actual */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                📋 Estado Actual del Sistema
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">
                    ✅ Características Implementadas:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Detección de cambios en tiempo real</li>
                    <li>• Auto-cancelación de guardados previos</li>
                    <li>
                      • Guardado exactamente 2 segundos después del último
                      cambio
                    </li>
                    <li>• Logging detallado con timestamps precisos</li>
                    <li>• Manejo robusto de errores</li>
                    <li>• Interface completamente sutil</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🧪 Para Probar:</h4>
                  <ol className="space-y-2 text-sm">
                    <li>1. Escribe algo en el editor</li>
                    <li>
                      2. Sigue escribiendo (debería cancelar guardados
                      anteriores)
                    </li>
                    <li>3. Para de escribir y espera 2 segundos</li>
                    <li>4. Observa el log de "GUARDADO EXITOSO"</li>
                    <li>5. Verifica que el contador de guardados aumente</li>
                  </ol>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
