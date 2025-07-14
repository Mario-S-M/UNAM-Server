"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";
import { updateContentMarkdown } from "@/app/actions/content-actions";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function TestAutoSaveSimplePage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TestAutoSaveSimpleContent />
    </RouteGuard>
  );
}

function TestAutoSaveSimpleContent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [saveCount, setSaveCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 1,
    });
    const logEntry = `[${timestamp}] ${message}`;
    setLogs((prev) => [logEntry, ...prev.slice(0, 19)]); // Mantener últimos 20 logs
    
  };

  const testContent = `# 🔧 Prueba Simple de Auto-Guardado

## Instrucciones
1. **Edita este texto** - agrega o modifica cualquier contenido
2. **Espera 2 segundos** - el auto-guardado se ejecutará automáticamente
3. **Observa los indicadores** - verás confirmación en tiempo real

## Contenido de Prueba

### Lista de Verificación
- [ ] Editor detecta cambios ✓
- [ ] Auto-save se ejecuta ✓
- [ ] Backend recibe petición ✓
- [ ] Datos se guardan ✓

### Notas de Prueba
**Modifica cualquier parte de este contenido para activar el sistema de auto-guardado.**

Los cambios se guardan automáticamente cada 2 segundos después de dejar de escribir.

---
*Prueba iniciada: ${new Date().toLocaleString("es-ES")}*
`;

  useEffect(() => {
    addLog("🚀 Sistema de auto-guardado inicializado");
    addLog("📝 Editor configurado con debounce de 2 segundos");
    addLog("✅ Listo para detectar cambios");
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🔧 Prueba Simple de Auto-Guardado
          </h1>
          <p className="text-gray-600">
            Verificación rápida del flujo completo de auto-guardado
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
              <div className="text-sm text-gray-600">Errores</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-sm font-bold text-blue-600">
                {lastSaveTime
                  ? lastSaveTime.toLocaleTimeString("es-ES")
                  : "Nunca"}
              </div>
              <div className="text-sm text-gray-600">Último Guardado</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card className="min-h-[500px]">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">📝 Editor con Auto-Save</h2>
              <div className="flex gap-2">
                {saveCount > 0 && (
                  <Chip color="success" size="sm">
                    ✅ Funcionando
                  </Chip>
                )}
                {errorCount > 0 && (
                  <Chip color="danger" size="sm">
                    ❌ {errorCount} errores
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div className="h-[400px]">
                <MilkdownEditorClientFixed
                  defaultValue={testContent}
                  contentId="test-simple-autosave"
                  onSave={async (content: string) => {
                    addLog(
                      `🔄 Auto-save iniciado: ${content.length} caracteres`
                    );

                    try {
                      const result = await updateContentMarkdown(
                        "test-simple-autosave",
                        content
                      );
                      if (result.error) {
                        addLog(`❌ Error en auto-save: ${result.error}`);
                        setErrorCount((prev) => prev + 1);
                      } else {
                        addLog(`✅ Auto-save EXITOSO: guardado completado`);
                        setSaveCount((prev) => prev + 1);
                        setLastSaveTime(new Date());
                      }
                    } catch (error) {
                      const errorMsg =
                        error instanceof Error
                          ? error.message
                          : "Error desconocido";
                      addLog(`❌ Excepción en auto-save: ${errorMsg}`);
                      setErrorCount((prev) => prev + 1);
                    }
                  }}
                />
              </div>
            </CardBody>
          </Card>

          {/* Logs */}
          <Card className="min-h-[500px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">
                📊 Actividad en Tiempo Real
              </h2>
            </CardHeader>
            <CardBody>
              <div className="h-[400px] overflow-y-auto">
                <div className="space-y-1 font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">
                      Esperando actividad...
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs border-l-2 ${
                          log.includes("✅")
                            ? "bg-green-50 border-green-400 text-green-800"
                            : log.includes("❌")
                            ? "bg-red-50 border-red-400 text-red-800"
                            : log.includes("🔄")
                            ? "bg-blue-50 border-blue-400 text-blue-800"
                            : log.includes("🚀") || log.includes("📝")
                            ? "bg-purple-50 border-purple-400 text-purple-800"
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

        {/* Test Manual */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">🧪 Prueba Manual</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">📋 Qué Hacer:</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Haz clic en el editor arriba</li>
                  <li>2. Escribe o modifica cualquier texto</li>
                  <li>3. Espera 2 segundos sin escribir</li>
                  <li>4. Observa el incremento en "Guardados Exitosos"</li>
                  <li>5. Verifica los logs en tiempo real</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">✅ Qué Verificar:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Cambios se detectan inmediatamente</li>
                  <li>• Auto-save se ejecuta a los 2 segundos</li>
                  <li>• Contador de guardados aumenta</li>
                  <li>• No hay errores en los logs</li>
                  <li>• Timestamp del último guardado se actualiza</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
