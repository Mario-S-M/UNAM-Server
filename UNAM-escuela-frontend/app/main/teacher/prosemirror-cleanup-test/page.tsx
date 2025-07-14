"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import {
  cleanupDuplicateProseMirror,
  checkForDuplicates,
} from "@/app/utils/editor-cleanup";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function ProseMirrorCleanupTestPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <ProseMirrorCleanupTestContent />
    </RouteGuard>
  );
}

function ProseMirrorCleanupTestContent() {
  type EditorStatsDetails = {
    containerDuplicates: boolean;
    milkdownDuplicates: boolean;
    proseMirrorDuplicates: boolean;
    orphanedProseMirror: number;
    proseMirrorByContainer: Record<string, number>;
  };
  const [logs, setLogs] = useState<string[]>([]);
  const [editorStats, setEditorStats] = useState<{
    containers: number;
    milkdown: number;
    prosemirror: number;
    hasDuplicates: boolean;
    details: EditorStatsDetails | null;
  }>({
    containers: 0,
    milkdown: 0,
    prosemirror: 0,
    hasDuplicates: false,
    details: null,
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

  const checkStatus = () => {
    const status = checkForDuplicates();
    setEditorStats({
      ...status.counts,
      hasDuplicates: status.hasDuplicates,
      details: status.details,
    });

    addLog(
      `📊 Estado: ${status.counts.containers} containers, ${status.counts.milkdown} milkdown, ${status.counts.prosemirror} prosemirror`
    );

    if (status.details?.proseMirrorDuplicates) {
      addLog("⚠️ ProseMirror duplicados detectados!");
      Object.entries(status.details.proseMirrorByContainer).forEach(
        ([containerId, count]) => {
          if (typeof count === "number" && count > 1) {
            addLog(`🔍 Container ${containerId}: ${count} ProseMirror`);
          }
        }
      );
    } else if (status.hasDuplicates) {
      addLog("⚠️ Otras duplicaciones detectadas");
    } else {
      addLog("✅ Sin duplicaciones encontradas");
    }

    return status;
  };

  const cleanupProseMirror = () => {
    addLog("🎯 Iniciando limpieza específica de ProseMirror...");
    const result = cleanupDuplicateProseMirror();
    addLog(
      `✅ Limpieza ProseMirror completada: ${result.removed} removidos, ${result.remaining} restantes`
    );

    // Verificar estado después de limpieza
    setTimeout(() => {
      checkStatus();
    }, 500);
  };

  const testContent = `# 🎯 Prueba de Limpieza ProseMirror

## 🔍 Problema Detectado
Se han encontrado **2 ProseMirror** cuando debería haber solo **1**.

## 🧪 Objetivo
Limpiar específicamente los editores ProseMirror duplicados sin afectar el container principal.

## 📊 Estado Actual
- Containers: Se actualizará automáticamente
- Milkdown: Se actualizará automáticamente  
- ProseMirror: **Se están limpiando duplicados**

## 🛠️ Solución Implementada
1. Detección específica de ProseMirror duplicados por container
2. Limpieza selectiva manteniendo solo el primer ProseMirror
3. Verificación post-limpieza

## ✅ Resultado Esperado
Después de la limpieza debería haber exactamente **1 ProseMirror** por editor.

---
*Prueba iniciada para resolver duplicaciones específicas de ProseMirror*
`;

  useEffect(() => {
    addLog("🎯 Iniciando prueba específica de limpieza ProseMirror");
    addLog("🔍 Problema: 2 ProseMirror detectados cuando debería haber 1");

    // Verificar estado inicial
    setTimeout(checkStatus, 1000);

    // Verificar periódicamente
    const interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🎯 Limpieza Específica de ProseMirror
          </h1>
          <p className="text-gray-600">
            Solución específica para el problema de ProseMirror duplicados
          </p>
        </div>

        {/* Estado detallado */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card
            className={
              editorStats.hasDuplicates
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }
          >
            <CardHeader>
              <h3 className="text-sm font-semibold">Estado General</h3>
            </CardHeader>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  editorStats.hasDuplicates ? "text-red-600" : "text-green-600"
                }`}
              >
                {editorStats.hasDuplicates ? "❌" : "✅"}
              </div>
              <div className="text-sm text-gray-600">
                {editorStats.hasDuplicates
                  ? "Duplicaciones"
                  : "Sin duplicaciones"}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">Containers</h3>
            </CardHeader>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  editorStats.containers !== 1
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {editorStats.containers}
              </div>
              <div className="text-sm text-gray-600">Esperado: 1</div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">Milkdown</h3>
            </CardHeader>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  editorStats.milkdown !== 1 ? "text-red-600" : "text-green-600"
                }`}
              >
                {editorStats.milkdown}
              </div>
              <div className="text-sm text-gray-600">Esperado: 1</div>
            </CardBody>
          </Card>

          <Card
            className={
              editorStats.prosemirror > 1
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }
          >
            <CardHeader>
              <h3 className="text-sm font-semibold">ProseMirror</h3>
            </CardHeader>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  editorStats.prosemirror > 1
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {editorStats.prosemirror}
              </div>
              <div className="text-sm text-gray-600">
                {editorStats.prosemirror > 1 ? "¡DUPLICADOS!" : "Esperado: 1"}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Controles de limpieza */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button color="primary" onPress={checkStatus} className="w-full">
            🔍 Verificar Estado
          </Button>

          <Button
            color="warning"
            onPress={cleanupProseMirror}
            className="w-full"
            disabled={!editorStats.details?.proseMirrorDuplicates}
          >
            🎯 Limpiar ProseMirror Duplicados
          </Button>

          <Button
            color="success"
            onPress={() => window.location.reload()}
            className="w-full"
          >
            🔄 Recargar Página
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor para prueba */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📝 Editor de Prueba</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px]">
                <MilkdownEditorClientFixed
                  defaultValue={testContent}
                  contentId="prosemirror-cleanup-test"
                  onSave={async (content: string) => {
                    addLog(
                      `💾 Auto-save ejecutado: ${content.length} caracteres`
                    );
                  }}
                />
              </div>
            </CardBody>
          </Card>

          {/* Logs de estado */}
          <Card className="min-h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-semibold">📊 Logs de Estado</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[500px] overflow-y-auto">
                <div className="space-y-2 font-mono text-sm">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs border-l-4 ${
                        log.includes("✅") || log.includes("🎯")
                          ? "bg-green-50 border-green-400 text-green-800"
                          : log.includes("⚠️") ||
                            log.includes("❌") ||
                            log.includes("DUPLICADOS")
                          ? "bg-red-50 border-red-400 text-red-800"
                          : log.includes("🔍") || log.includes("📊")
                          ? "bg-blue-50 border-blue-400 text-blue-800"
                          : "bg-gray-50 border-gray-400 text-gray-800"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Explicación del problema */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">🔍 Análisis del Problema</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-red-700">
                  ❌ Problema Detectado:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• 1 Container ✅</li>
                  <li>• 1 Milkdown ✅</li>
                  <li>
                    • <strong>2 ProseMirror ❌</strong> (debería ser 1)
                  </li>
                  <li>• Causa: Inicialización doble interna de Milkdown</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-green-700">
                  ✅ Solución Implementada:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Detección específica de ProseMirror por container</li>
                  <li>• Limpieza selectiva manteniendo solo el primero</li>
                  <li>• Verificación post-inicialización en el editor</li>
                  <li>• Herramientas de limpieza manual disponibles</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
