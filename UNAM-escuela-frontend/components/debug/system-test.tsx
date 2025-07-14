"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Badge, Divider } from "@heroui/react";
import { Play, CheckCircle, AlertTriangle, XCircle, Zap } from "lucide-react";
import { SystemTest } from "@/app/utils/system-test";

export function SystemTestComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastTest, setLastTest] = useState<any>(null);
  const [quickTest, setQuickTest] = useState<any>(null);

  const runQuickTest = async () => {
    setIsRunning(true);
    try {
      const contentId = "c47348eb-ee90-4b6d-8b08-2b51bfd38e49"; // ID del contenido problemático
      const result = await SystemTest.runAllTests(contentId);
      setQuickTest(result);
    } catch (error: any) {
      console.error("Error en prueba rápida:", error);
      setQuickTest({
        overallStatus: "critical",
        tests: {
          connectivity: false,
          authentication: "missing",
          contentDiagnostic: false,
        },
        summary:
          "Error ejecutando pruebas: " + (error?.message || String(error)),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runCompleteTest = async () => {
    setIsRunning(true);
    try {
      const contentId = "c47348eb-ee90-4b6d-8b08-2b51bfd38e49";
      const result = await SystemTest.runCompleteTest(contentId);
      setLastTest(result);
    } catch (error: any) {
      console.error("Error en prueba completa:", error);
      setLastTest({
        success: false,
        results: { error: error?.message || String(error) },
        recommendations: ["Error ejecutando la prueba completa"],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string | boolean) => {
    if (status === "healthy" || status === "valid" || status === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status === "issues" || status === "invalid") {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    } else if (
      status === "critical" ||
      status === "missing" ||
      status === false
    ) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string | boolean) => {
    if (status === "healthy" || status === "valid" || status === true) {
      return "success";
    } else if (status === "issues" || status === "invalid") {
      return "warning";
    } else if (
      status === "critical" ||
      status === "missing" ||
      status === false
    ) {
      return "danger";
    } else {
      return "default";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pruebas del Sistema</h3>
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="bordered"
                size="sm"
                onPress={runQuickTest}
                isLoading={isRunning}
                startContent={!isRunning && <Zap className="w-4 h-4" />}
              >
                Prueba Rápida
              </Button>
              <Button
                color="secondary"
                size="sm"
                onPress={runCompleteTest}
                isLoading={isRunning}
                startContent={!isRunning && <Play className="w-4 h-4" />}
              >
                Prueba Completa
              </Button>
            </div>
          </div>

          {quickTest && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(quickTest.overallStatus)}
                <span className="font-medium">Estado General:</span>
                <Badge
                  color={getStatusColor(quickTest.overallStatus)}
                  variant="flat"
                >
                  {quickTest.overallStatus.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-default-600 mb-3">
                {quickTest.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Conectividad</span>
                  {getStatusIcon(quickTest.tests.connectivity)}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Autenticación</span>
                  {getStatusIcon(quickTest.tests.authentication)}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Diagnóstico</span>
                  {getStatusIcon(quickTest.tests.contentDiagnostic)}
                </div>
              </div>
            </div>
          )}

          {lastTest && (
            <>
              <Divider className="my-4" />
              <div>
                <h4 className="font-medium mb-3">
                  Resultados de Prueba Completa
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  {getStatusIcon(lastTest.success)}
                  <span className="text-sm">
                    Estado: {lastTest.success ? "Exitosa" : "Falló"}
                  </span>
                </div>

                {lastTest.recommendations &&
                  lastTest.recommendations.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">
                        Recomendaciones:
                      </p>
                      <ul className="text-xs space-y-1">
                        {lastTest.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <details className="text-xs">
                  <summary className="cursor-pointer text-default-500 hover:text-default-700">
                    Ver detalles técnicos
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                    {JSON.stringify(lastTest.results, null, 2)}
                  </pre>
                </details>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
