"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
  getContentMarkdown,
  getContentById,
} from "@/app/actions/content-actions";

export default function DebugContentPage() {
  const [contentId, setContentId] = useState(
    "2c2a1f95-a61e-4644-89a1-09a09ce7c97a"
  );

  // Query para obtener información del contenido
  const {
    data: contentInfo,
    isLoading: contentLoading,
    error: contentError,
    refetch: refetchContent,
  } = useQuery({
    queryKey: ["content-debug", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  // Query para obtener el markdown
  const {
    data: markdownData,
    isLoading: markdownLoading,
    error: markdownError,
    refetch: refetchMarkdown,
  } = useQuery({
    queryKey: ["markdown-debug", contentId],
    queryFn: () => getContentMarkdown(contentId),
    enabled: !!contentId,
  });

  const handleRefresh = () => {
    refetchContent();
    refetchMarkdown();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🔧 Debug de Contenido Markdown
          </h1>
          <p className="text-gray-600">
            Página para debuggear la carga de contenido markdown desde el
            servidor
          </p>
        </div>

        {/* Content ID Input */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Content ID</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2">
              <Input
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="ID del contenido"
                className="flex-1"
              />
              <Button color="primary" onPress={handleRefresh}>
                🔄 Refrescar
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Info */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                📋 Información del Contenido
              </h2>
            </CardHeader>
            <CardBody>
              {contentLoading && <p>Cargando información...</p>}
              {contentError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800">
                    ❌ Error: {contentError.message}
                  </p>
                </div>
              )}
              {contentInfo && (
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {contentInfo.data?.id}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {contentInfo.data?.name}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {contentInfo.data?.description}
                  </p>
                  <p>
                    <strong>Level ID:</strong> {contentInfo.data?.levelId}
                  </p>
                  <p>
                    <strong>Estado:</strong> {contentInfo.data?.status}
                  </p>
                  <p>
                    <strong>Markdown Path:</strong>{" "}
                    {contentInfo.data?.markdownPath || "No definido"}
                  </p>
                  <p>
                    <strong>Profesores asignados:</strong>{" "}
                    {contentInfo.data?.assignedTeachers?.length || 0}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Markdown Content */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">📝 Contenido Markdown</h2>
            </CardHeader>
            <CardBody>
              {markdownLoading && <p>Cargando markdown...</p>}
              {markdownError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800">
                    ❌ Error: {markdownError.message}
                  </p>
                </div>
              )}
              {markdownData && (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800">
                      ✅ Markdown cargado exitosamente
                    </p>
                    <p className="text-sm">
                      Longitud: {markdownData.data?.length || 0} caracteres
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap">
                      {markdownData.data || "Sin contenido"}
                    </pre>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* File System Debug */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              📁 Debug del Sistema de Archivos
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 text-sm font-mono">
              <p>
                <strong>Ruta esperada del archivo:</strong>
              </p>
              <p className="bg-gray-100 p-2 rounded">
                /Users/mac/Documents/UNAM-Server/Markdown/italiano/a2/prueba-de-itailiano/prueba-de-itailiano.md
              </p>

              <p>
                <strong>Contenido ID actual:</strong>
              </p>
              <p className="bg-gray-100 p-2 rounded">{contentId}</p>

              <p>
                <strong>¿El archivo existe?</strong>
              </p>
              <p className="text-green-600">✅ Sí (verificado manualmente)</p>
            </div>
          </CardBody>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">📖 Instrucciones</h2>
          </CardHeader>
          <CardBody>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Verifica que el Content ID sea correcto</li>
              <li>
                Revisa que la información del contenido se cargue correctamente
              </li>
              <li>Observa si hay errores en la carga del markdown</li>
              <li>Revisa la consola del navegador para logs adicionales</li>
              <li>
                Verifica que el usuario tenga permisos para acceder al contenido
              </li>
            </ol>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
