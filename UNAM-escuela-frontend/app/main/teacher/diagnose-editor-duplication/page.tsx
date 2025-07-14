"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function DiagnoseEditorDuplicationPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <DiagnoseEditorDuplicationContent />
    </RouteGuard>
  );
}

function DiagnoseEditorDuplicationContent() {
  const [logs, setLogs] = useState<string[]>([]);
  const [mountCount, setMountCount] = useState(0);
  const [editorCount, setEditorCount] = useState(0);

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

  // Contar editores en el DOM
  const countEditorsInDOM = () => {
    const editors = document.querySelectorAll("[data-editor-id]");
    const crepeEditors = document.querySelectorAll(".milkdown-container");
    const proseMirrorEditors = document.querySelectorAll(".ProseMirror");

    setEditorCount(editors.length);
    addLog(
      `📊 Editores encontrados: ${editors.length} con data-editor-id, ${crepeEditors.length} milkdown-container, ${proseMirrorEditors.length} ProseMirror`
    );

    // Mostrar IDs de editores
    editors.forEach((editor, index) => {
      const editorId = editor.getAttribute("data-editor-id");
      addLog(`📝 Editor ${index + 1}: ID = ${editorId}`);
    });
  };

  const testContent = `# 🔍 Diagnóstico de Duplicación de Editores

## 🎯 Objetivo
Identificar y resolver el problema de editores duplicados.

## 📊 Estado Actual
- Editors en DOM: Se actualizará automáticamente
- Instancias activas: Verificando...

## 🧪 Instrucciones
1. Observa el contador de editores arriba
2. Revisa los logs para ver IDs únicos
3. Edita este texto para verificar funcionalidad
4. Comprueba que solo haya un editor activo

---
*Diagnóstico iniciado el ${new Date().toISOString()}*
`;

  useEffect(() => {
    addLog("🚀 Iniciando diagnóstico de duplicación de editores");
    setMountCount((prev) => prev + 1);
    addLog(`🔢 Número de montajes de este componente: ${mountCount + 1}`);

    // Contar editores cada 2 segundos
    const interval = setInterval(countEditorsInDOM, 2000);

    // Limpiar al desmontar
    return () => {
      clearInterval(interval);
      addLog("🧹 Componente desmontado");
    };
  }, []);

  // Verificar editores manualmente
  const handleManualCheck = () => {
    addLog("🔍 Verificación manual solicitada");
    countEditorsInDOM();
  };

  // Limpiar editores huérfanos
  const cleanupOrphanedEditors = () => {
    addLog("🧹 Limpiando editores huérfanos...");

    // Buscar editores sin referencia activa
    const allEditors = document.querySelectorAll("[data-editor-id]");
    let cleaned = 0;

    allEditors.forEach((editor) => {
      const editorId = editor.getAttribute("data-editor-id");
      // Si el editor no tiene contenido activo, removerlo
      const hasActiveContent = editor.querySelector(".ProseMirror");
      if (!hasActiveContent || editor.children.length === 0) {
        addLog(`🗑️ Removiendo editor huérfano: ${editorId}`);
        editor.remove();
        cleaned++;
      }
    });

    addLog(`✅ Limpieza completada: ${cleaned} editores removidos`);
    setTimeout(countEditorsInDOM, 500);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🔍 Diagnóstico de Editores Duplicados
          </h1>
          <p className="text-gray-600">
            Identificar y resolver problemas de duplicación del editor Milkdown
          </p>
        </div>

        {/* Estadísticas en tiempo real */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card
            className={
              editorCount > 1
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }
          >
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  editorCount > 1 ? "text-red-600" : "text-green-600"
                }`}
              >
                {editorCount}
              </div>
              <div className="text-sm text-gray-600">Editores en DOM</div>
              {editorCount > 1 && (
                <div className="text-xs text-red-600 mt-1">¡DUPLICADOS!</div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mountCount}
              </div>
              <div className="text-sm text-gray-600">Montajes</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <Button size="sm" color="primary" onPress={handleManualCheck}>
                Verificar Ahora
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <Button
                size="sm"
                color="warning"
                onPress={cleanupOrphanedEditors}
              >
                Limpiar Huérfanos
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor único para diagnóstico */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">
                📝 Editor de Diagnóstico (ÚNICO)
              </h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px]">
                <MilkdownEditorClientFixed
                  defaultValue={testContent}
                  contentId="diagnostic-editor"
                  onSave={async (content: string) => {
                    addLog(
                      `💾 Auto-save ejecutado: ${content.length} caracteres`
                    );
                  }}
                />
              </div>
            </CardBody>
          </Card>

          {/* Logs de diagnóstico */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📊 Logs de Diagnóstico</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px] overflow-y-auto">
                <div className="space-y-2 font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">
                      Esperando logs...
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs border-l-4 ${
                          log.includes("🗑️") || log.includes("DUPLICADOS")
                            ? "bg-red-50 border-red-400 text-red-800"
                            : log.includes("✅") || log.includes("💾")
                            ? "bg-green-50 border-green-400 text-green-800"
                            : log.includes("🔍") || log.includes("📊")
                            ? "bg-blue-50 border-blue-400 text-blue-800"
                            : log.includes("🧹")
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

        {/* Instrucciones de diagnóstico */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              📋 Instrucciones de Diagnóstico
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-green-700">
                  ✅ Comportamiento Esperado:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Exactamente 1 editor en DOM</li>
                  <li>• ID único para cada instancia</li>
                  <li>• Auto-save funcionando correctamente</li>
                  <li>• Sin editores huérfanos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-red-700">
                  ❌ Signos de Problema:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Más de 1 editor en DOM</li>
                  <li>• IDs duplicados</li>
                  <li>• Editores sin contenido</li>
                  <li>• Múltiples instancias de ProseMirror</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
