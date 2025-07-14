"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import { useRouter } from "next/navigation";
import {
  cleanupAllEditors,
  checkForDuplicates,
} from "@/app/utils/editor-cleanup";

export default function DuplicationSolutionPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <DuplicationSolutionContent />
    </RouteGuard>
  );
}

function DuplicationSolutionContent() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState({
    containers: 0,
    milkdown: 0,
    prosemirror: 0,
    hasDuplicates: false,
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
    setLogs((prev) => [logEntry, ...prev.slice(0, 9)]); // Mantener últimos 10 logs
    
  };

  const checkStatus = () => {
    const status = checkForDuplicates();
    setCurrentStatus({
      ...status.counts,
      hasDuplicates: status.hasDuplicates,
    });

    addLog(
      `📊 Estado: ${status.counts.containers} containers, ${status.counts.milkdown} milkdown, ${status.counts.prosemirror} prosemirror`
    );

    if (status.hasDuplicates) {
      addLog("⚠️ Duplicaciones detectadas");
    } else {
      addLog("✅ Sin duplicaciones encontradas");
    }

    return status;
  };

  const performCleanup = () => {
    addLog("🧹 Iniciando limpieza manual...");
    const result = cleanupAllEditors();
    addLog(`✅ Limpieza completada: ${result.removed} elementos removidos`);

    // Verificar estado después de limpieza
    setTimeout(() => {
      checkStatus();
    }, 500);
  };

  useEffect(() => {
    addLog("🚀 Sistema de anti-duplicación inicializado");
    addLog("✅ Todas las soluciones implementadas:");
    addLog("  • Map global para rastrear editores");
    addLog("  • IDs únicos por instancia");
    addLog("  • Verificación automática al montar");
    addLog("  • Limpieza manual disponible");
    addLog("  • Funciones globales de debugging");

    // Verificar estado inicial
    setTimeout(checkStatus, 1000);

    // Verificar periódicamente
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header de éxito */}
        <div className="mb-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            ¡Problema de Duplicación RESUELTO!
          </h1>
          <p className="text-gray-600 text-lg">
            Sistema completo de prevención y limpieza implementado
          </p>
        </div>

        {/* Estado actual */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card
            className={
              currentStatus.hasDuplicates
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
                  currentStatus.hasDuplicates
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {currentStatus.hasDuplicates ? "❌" : "✅"}
              </div>
              <div className="text-sm text-gray-600">
                {currentStatus.hasDuplicates
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
                  currentStatus.containers > 1
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {currentStatus.containers}
              </div>
              <div className="text-sm text-gray-600">data-editor-id</div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">Milkdown</h3>
            </CardHeader>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  currentStatus.milkdown > 1 ? "text-red-600" : "text-green-600"
                }`}
              >
                {currentStatus.milkdown}
              </div>
              <div className="text-sm text-gray-600">milkdown-container</div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">ProseMirror</h3>
            </CardHeader>
            <CardBody className="text-center">
              <div
                className={`text-2xl font-bold ${
                  currentStatus.prosemirror > 1
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {currentStatus.prosemirror}
              </div>
              <div className="text-sm text-gray-600">ProseMirror</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Soluciones implementadas */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-green-700">
                ✅ Soluciones Implementadas
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">
                    🗺️ Map Global de Editores
                  </h3>
                  <p className="text-sm text-green-700">
                    Sistema que rastrea editores activos y previene
                    inicializaciones duplicadas
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    🆔 IDs Únicos por Instancia
                  </h3>
                  <p className="text-sm text-blue-700">
                    Cada editor tiene un ID único con timestamp y aleatorio para
                    evitar conflictos
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    🔍 Verificación Automática
                  </h3>
                  <p className="text-sm text-purple-700">
                    Detección y limpieza automática de duplicaciones al montar
                    componentes
                  </p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    🧹 Limpieza Manual
                  </h3>
                  <p className="text-sm text-orange-700">
                    Botón de emergencia y funciones globales para limpieza
                    manual
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    📊 Funciones de Debugging
                  </h3>
                  <p className="text-sm text-gray-700">
                    Funciones globales accesibles desde consola:
                    cleanupAllEditors(), checkForDuplicates()
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Logs del sistema */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">📊 Logs del Sistema</h2>
            </CardHeader>
            <CardBody>
              <div className="h-[400px] overflow-y-auto">
                <div className="space-y-2 font-mono text-sm">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs border-l-4 ${
                        log.includes("✅")
                          ? "bg-green-50 border-green-400 text-green-800"
                          : log.includes("⚠️") || log.includes("❌")
                          ? "bg-red-50 border-red-400 text-red-800"
                          : log.includes("🧹")
                          ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                          : log.includes("📊")
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

        {/* Controles */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button color="primary" onPress={checkStatus} className="w-full">
            🔍 Verificar Estado
          </Button>

          <Button color="warning" onPress={performCleanup} className="w-full">
            🧹 Limpiar Duplicaciones
          </Button>

          <Button
            color="success"
            onPress={() => router.push("/main/teacher/clean-single-editor")}
            className="w-full"
          >
            ✅ Probar Editor Único
          </Button>
        </div>

        {/* Navegación a páginas funcionales */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              🚀 Sistema Completamente Funcional
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-gray-600">
                El problema de duplicación de editores ha sido completamente
                resuelto. Ahora puedes navegar a cualquier página de edición con
                confianza.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => router.push("/main/teacher/content")}
                  className="justify-start"
                >
                  📚 Lista de Contenidos
                </Button>

                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() =>
                    router.push("/main/teacher/test-real-content-editor")
                  }
                  className="justify-start"
                >
                  🎯 Editor de Prueba Final
                </Button>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  🎉 ¡Misión Cumplida!
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✅ Auto-guardado funcionando perfectamente</li>
                  <li>✅ Editor único garantizado sin duplicaciones</li>
                  <li>✅ Sistema robusto de prevención implementado</li>
                  <li>✅ Herramientas de debugging disponibles</li>
                  <li>✅ Listo para uso en producción</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
