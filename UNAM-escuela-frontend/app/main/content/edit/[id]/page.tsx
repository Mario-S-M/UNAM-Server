"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getContentMarkdown } from "../../../../actions/content-actions";
import MilkdownEditorClient from "../../../../../components/global/milkdown-editor-client";

const ContentEditPage = () => {
  const params = useParams();
  const contentId = params.id as string;
  const [saveStatus, setSaveStatus] = React.useState<string>("");

  // Cargar contenido inicial
  const {
    data: contentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["content-markdown", contentId],
    queryFn: () => getContentMarkdown(contentId),
    enabled: !!contentId,
  });

  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      setSaveStatus("✅ Contenido guardado exitosamente");
    } else {
      setSaveStatus("❌ Error al guardar el contenido");
    }
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleAutoSaveError = (error: string) => {
    setSaveStatus(`🚨 Error: ${error}`);
    setTimeout(() => setSaveStatus(""), 5000);
  };

  if (!contentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">ID de contenido no válido</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">No se pudo cargar el contenido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Editor de Contenido
          </h1>
          <p className="text-default-500">
            Editando contenido ID: {contentId} - Auto-guardado cada 5 segundos
          </p>
        </div>

        {/* Status Message */}
        {saveStatus && (
          <div className="mb-4 p-3 rounded-lg">
            <p className="text-sm text-blue-800">{saveStatus}</p>
          </div>
        )}

        {/* Editor */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <MilkdownEditorClient
            defaultValue={
              contentData?.data ||
              "# Cargando contenido...\n\nEspera un momento..."
            }
            contentId={contentId} // Auto-guardado se activa automáticamente
            autoSaveInterval={5000} // 5 segundos
            onAutoSave={handleAutoSave}
            onAutoSaveError={handleAutoSaveError}
            showButtons={false} // Ocultar botones de guardar y descargar
            showStatusIndicator={true}
            statusPosition="top" // Indicador en la parte superior
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            💡 Cómo usar el editor con auto-guardado
          </h2>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
            <li>
              • <strong>Auto-guardado:</strong> El contenido se guarda
              automáticamente cada 5 segundos después de detectar cambios
            </li>
            <li>
              • <strong>Indicador verde:</strong> Muestra el estado del
              auto-guardado en tiempo real
            </li>
            <li>
              • <strong>Guardado en tiempo real:</strong> No necesitas hacer
              nada, el sistema guarda automáticamente
            </li>
            <li>
              • <strong>Persistencia:</strong> Al recargar la página, se cargará
              la última versión guardada
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentEditPage;
