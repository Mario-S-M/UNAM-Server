"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";
import { updateContentMarkdown } from "@/app/actions/content-actions";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function TestAutoSaveBackendPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TestAutoSaveBackendContent />
    </RouteGuard>
  );
}

function TestAutoSaveBackendContent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [networkTests, setNetworkTests] = useState({
    realContent: { success: false, error: "", testing: false },
    testContent: { success: false, error: "", testing: false },
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 1,
    });
    const logEntry = `[${timestamp}] ${message}`;
    setLogs((prev) => [logEntry, ...prev.slice(0, 14)]); // Mantener últimos 15 logs
    
  };

  // Probar conexión directa con backend
  const testRealBackend = async () => {
    setNetworkTests((prev) => ({
      ...prev,
      realContent: { ...prev.realContent, testing: true },
    }));
    addLog("🔄 Probando conexión con content ID real...");

    try {
      const result = await updateContentMarkdown(
        "test-real-content",
        "# Test Content\n\nEste es un test de contenido real."
      );
      if (result.error) {
        addLog(`❌ Error con content ID real: ${result.error}`);
        setNetworkTests((prev) => ({
          ...prev,
          realContent: {
            success: false,
            error: result.error || "",
            testing: false,
          },
        }));
      } else {
        addLog(`✅ Content ID real funciona: ${JSON.stringify(result.data)}`);
        setNetworkTests((prev) => ({
          ...prev,
          realContent: { success: true, error: "", testing: false },
        }));
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      addLog(`❌ Excepción con content ID real: ${errorMsg}`);
      setNetworkTests((prev) => ({
        ...prev,
        realContent: { success: false, error: errorMsg, testing: false },
      }));
    }
  };

  const testMockBackend = async () => {
    setNetworkTests((prev) => ({
      ...prev,
      testContent: { ...prev.testContent, testing: true },
    }));
    addLog("🔄 Probando conexión con content ID de prueba...");

    try {
      const result = await updateContentMarkdown(
        "test-mock-content",
        "# Mock Test Content\n\nEste es un test simulado."
      );
      if (result.error) {
        addLog(`❌ Error con content ID de prueba: ${result.error}`);
        setNetworkTests((prev) => ({
          ...prev,
          testContent: {
            success: false,
            error: result.error || "",
            testing: false,
          },
        }));
      } else {
        addLog(
          `✅ Content ID de prueba funciona: ${JSON.stringify(result.data)}`
        );
        setNetworkTests((prev) => ({
          ...prev,
          testContent: { success: true, error: "", testing: false },
        }));
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      addLog(`❌ Excepción con content ID de prueba: ${errorMsg}`);
      setNetworkTests((prev) => ({
        ...prev,
        testContent: { success: false, error: errorMsg, testing: false },
      }));
    }
  };

  const testContent = `# 🚀 Prueba de Conexión Backend

## ✅ Objetivo
Verificar que el auto-guardado llegue correctamente al backend de GraphQL.

## 🔍 Qué Probar
1. **Edita este contenido** - cualquier cambio
2. **Espera 2 segundos** - tiempo de debounce
3. **Observa los logs** abajo para ver si:
   - Se detecta el cambio
   - Se llama a updateContentMarkdown
   - Llega al backend GraphQL
   - Se guarda en la base de datos

## 🎯 Contenido de Prueba

### Lista de Verificación
- [ ] ¿Se detectan los cambios?
- [ ] ¿Se ejecuta el auto-save?
- [ ] ¿Llega la petición al backend?
- [ ] ¿Se actualiza la base de datos?

### Tabla de Estados
| Componente | Estado | Notas |
|------------|--------|-------|
| Editor | ✓ Funcional | Detectando cambios |
| Auto-save | ? Probando | Cada 2 segundos |
| GraphQL | ? Probando | Endpoint configurado |
| Backend | ? Probando | Esperando respuesta |

## 📝 Notas
**Edita cualquier parte de este contenido para activar el auto-guardado y verificar la conexión completa.**

---
*Timestamp de prueba: ${new Date().toISOString()}*
`;

  useEffect(() => {
    addLog("🚀 Iniciando prueba de conexión con backend");
    addLog("🎯 Objetivo: Verificar que auto-save llegue a GraphQL/DB");
    addLog("⏰ Editor configurado con debounce de 2 segundos");
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🔗 Prueba de Conexión Backend
          </h1>
          <p className="text-gray-600">
            Verificar que el auto-guardado llegue correctamente al backend de
            GraphQL
          </p>
        </div>

        {/* Tests de conexión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">🧪 Test ID Simulado</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Prueba con ID que simula guardado exitoso
                </p>
                <Button
                  color={
                    networkTests.testContent.success ? "success" : "primary"
                  }
                  onPress={testMockBackend}
                  isLoading={networkTests.testContent.testing}
                  size="sm"
                >
                  {networkTests.testContent.success
                    ? "✅ Éxito"
                    : "Probar Simulado"}
                </Button>
                {networkTests.testContent.error && (
                  <p className="text-xs text-red-600">
                    {networkTests.testContent.error}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">🌐 Test Backend Real</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Prueba con backend real de GraphQL
                </p>
                <Button
                  color={
                    networkTests.realContent.success ? "success" : "secondary"
                  }
                  onPress={testRealBackend}
                  isLoading={networkTests.realContent.testing}
                  size="sm"
                >
                  {networkTests.realContent.success
                    ? "✅ Éxito"
                    : "Probar Real"}
                </Button>
                {networkTests.realContent.error && (
                  <p className="text-xs text-red-600">
                    {networkTests.realContent.error}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📝 Editor con Auto-Save</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px]">
                <MilkdownEditorClientFixed
                  defaultValue={testContent}
                  contentId="test-backend-connection"
                  onSave={async (content: string) => {
                    addLog(
                      `🔄 Auto-save iniciado: ${content.length} caracteres`
                    );
                    try {
                      const result = await updateContentMarkdown(
                        "test-backend-connection",
                        content
                      );
                      if (result.error) {
                        addLog(`❌ Error en auto-save: ${result.error}`);
                      } else {
                        addLog(
                          `✅ Auto-save exitoso: ${JSON.stringify(result.data)}`
                        );
                      }
                    } catch (error) {
                      const errorMsg =
                        error instanceof Error
                          ? error.message
                          : "Error desconocido";
                      addLog(`❌ Excepción en auto-save: ${errorMsg}`);
                    }
                  }}
                />
              </div>
            </CardBody>
          </Card>

          {/* Logs de conexión */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📊 Logs de Conexión</h2>
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
                            : log.includes("🎯") || log.includes("⏰")
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
            <h2 className="text-xl font-semibold">
              📋 Instrucciones de Prueba
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">🎯 Pasos a Seguir:</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Ejecuta los tests de conexión arriba</li>
                  <li>2. Edita el contenido del editor</li>
                  <li>3. Espera 2 segundos (tiempo de debounce)</li>
                  <li>4. Observa los logs para ver el flujo completo</li>
                  <li>5. Verifica que llegue al backend</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">✅ Qué Verificar:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Cambios detectados automáticamente</li>
                  <li>• Auto-save ejecutándose a los 2 segundos</li>
                  <li>• Petición llegando a updateContentMarkdown</li>
                  <li>• Respuesta exitosa del backend GraphQL</li>
                  <li>• Sin errores en los logs</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
