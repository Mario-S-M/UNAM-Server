"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Input, Textarea } from "@heroui/react";
import {
  getContentMarkdown,
  getContentById,
} from "@/app/actions/content-actions";
import { useContentDebugger } from "@/app/utils/content-debug";
import { SystemTestComponent } from "@/components/debug/system-test";

export default function ContentTestPage() {
  const [contentId, setContentId] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { diagnoseContent } = useContentDebugger();

  // Generar un UUID de prueba
  const generateTestUUID = () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000"; // UUID de prueba válido
    setContentId(uuid);
  };

  // Usar el UUID de tu archivo actual
  const useCurrentContentId = () => {
    // Este debería ser el ID que está causando problemas
    setContentId("prueba-de-cotenido"); // O el ID real del contenido que estás intentando editar
  };

  const testContent = async () => {
    if (!contentId.trim()) return;

    setLoading(true);
    setResults(null);

    try {
      console.log("🧪 Iniciando prueba de contenido:", contentId);

      // 1. Diagnóstico
      const diagnostic = await diagnoseContent(contentId);

      // 2. Probar getContentById
      const contentResult = await getContentById(contentId);

      // 3. Probar getContentMarkdown
      const markdownResult = await getContentMarkdown(contentId);

      setResults({
        diagnostic,
        contentResult,
        markdownResult,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setResults({
        error: error,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold mb-4">
              🧪 Probador de Contenidos
            </h1>
            <p className="text-gray-600 mb-6">
              Herramienta para diagnosticar problemas con contenidos específicos
            </p>

            <div className="space-y-4">
              <Input
                label="ID del Contenido"
                placeholder="Ingresa el UUID del contenido a probar"
                value={contentId}
                onValueChange={setContentId}
                description="Puedes usar cualquier UUID válido"
              />

              <div className="flex gap-2">
                <Button
                  color="secondary"
                  variant="bordered"
                  size="sm"
                  onPress={generateTestUUID}
                >
                  UUID de Prueba
                </Button>
                <Button
                  color="warning"
                  variant="bordered"
                  size="sm"
                  onPress={useCurrentContentId}
                >
                  ID Problemático
                </Button>
              </div>

              <Button
                color="primary"
                onPress={testContent}
                isLoading={loading}
                isDisabled={!contentId.trim()}
              >
                {loading ? "Probando..." : "Probar Contenido"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Componente de pruebas del sistema */}
        <SystemTestComponent />

        {results && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">📊 Resultados</h2>

              {results.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="font-medium text-red-800 mb-2">Error</h3>
                  <pre className="text-sm text-red-700 overflow-auto">
                    {JSON.stringify(results.error, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Diagnóstico */}
                  <div>
                    <h3 className="font-medium mb-2">🔍 Diagnóstico</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>ID Válido:</strong>{" "}
                          {results.diagnostic?.checks?.idFormat ? "✅" : "❌"}
                        </div>
                        <div>
                          <strong>Servidor:</strong>{" "}
                          {results.diagnostic?.checks?.serverReachable
                            ? "✅"
                            : "❌"}
                        </div>
                        <div>
                          <strong>Auth:</strong>{" "}
                          {results.diagnostic?.checks?.hasPermissions
                            ? "✅"
                            : "❌"}
                        </div>
                      </div>
                      {results.diagnostic?.recommendations && (
                        <div className="mt-3">
                          <strong>Recomendaciones:</strong>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {results.diagnostic.recommendations.map(
                              (rec: string, i: number) => (
                                <li key={i}>{rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resultado de getContentById */}
                  <div>
                    <h3 className="font-medium mb-2">📄 getContentById</h3>
                    <div
                      className={`border rounded p-4 ${
                        results.contentResult?.success
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="text-sm">
                        <strong>Estado:</strong>{" "}
                        {results.contentResult?.success ? "Éxito" : "Error"}
                      </div>
                      {results.contentResult?.error && (
                        <div className="text-sm mt-2">
                          <strong>Error:</strong> {results.contentResult.error}
                        </div>
                      )}
                      {results.contentResult?.data && (
                        <div className="text-sm mt-2">
                          <strong>Datos:</strong> Contenido encontrado -{" "}
                          {results.contentResult.data.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resultado de getContentMarkdown */}
                  <div>
                    <h3 className="font-medium mb-2">📝 getContentMarkdown</h3>
                    <div
                      className={`border rounded p-4 ${
                        results.markdownResult?.data
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="text-sm">
                        <strong>Estado:</strong>{" "}
                        {results.markdownResult?.data ? "Éxito" : "Error"}
                      </div>
                      {results.markdownResult?.error && (
                        <div className="text-sm mt-2">
                          <strong>Error:</strong> {results.markdownResult.error}
                        </div>
                      )}
                      {results.markdownResult?.data && (
                        <div className="text-sm mt-2">
                          <strong>Contenido:</strong>{" "}
                          {results.markdownResult.data.length} caracteres
                          <Textarea
                            className="mt-2"
                            value={
                              results.markdownResult.data.substring(0, 500) +
                              "..."
                            }
                            readOnly
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datos completos */}
                  <details>
                    <summary className="cursor-pointer font-medium">
                      📋 Ver datos completos
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-96">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
