"use client";

import React from "react";
import MilkdownEditorClient from "../../../../components/global/milkdown-editor-client";

export default function TestEditorFinalPage() {
  const [logs, setLogs] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      addLog(
        `✅ Auto-guardado exitoso. Contenido: ${content.substring(0, 50)}...`
      );
    } else {
      addLog(
        `❌ Error en auto-guardado. Contenido: ${content.substring(0, 50)}...`
      );
    }
  };

  const handleAutoSaveError = (error: string) => {
    addLog(`🚨 Error de auto-guardado: ${error}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Prueba Final del Editor
            </h1>
            <p className="text-sm text-gray-600">
              Prueba el auto-guardado cada 5 segundos y la ocultación de botones
              negrita/cursiva
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Content ID: test-content-123
          </div>
        </div>
      </div>

      {/* Editor en pantalla completa */}
      <div className="flex-1 relative">
        <MilkdownEditorClient
          defaultValue="# Prueba Final del Editor

Este es un editor de **prueba** con auto-guardado cada *5 segundos*.

## Características:
- ✅ Auto-guardado activado
- ✅ Toolbar oscuro 
- ✅ Sin botones de negrita/cursiva
- ✅ Indicador flotante discreto

Escribe algo para probar el auto-guardado..."
          contentId="test-content-123"
          autoSaveInterval={5000}
          onAutoSave={handleAutoSave}
          onAutoSaveError={handleAutoSaveError}
          showButtons={false}
          showStatusIndicator={true}
          statusPosition="top"
        />
      </div>

      {/* Panel de logs flotante */}
      <div className="fixed bottom-4 left-4 w-96 max-h-48 bg-black/90 text-white text-xs p-4 rounded-lg overflow-y-auto z-50">
        <div className="font-bold mb-2">📝 Logs de Auto-guardado:</div>
        {logs.length === 0 ? (
          <div className="text-gray-400">Esperando actividad...</div>
        ) : (
          logs.slice(-10).map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
