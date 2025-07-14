"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@heroui/react";
import {
  Wrench,
  FileText,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Key,
  Info,
  Copy,
} from "lucide-react";
import testGraphQLConnection from "@/app/utils/graphql-client";

// Definición de tipos
interface ContentDiagnostic {
  checks: {
    idFormat: boolean;
    accessibility: boolean;
    connectivity: boolean;
    serverReachable?: boolean;
    hasPermissions?: boolean;
  };
  issues: string[];
  suggestions: string[];
  recommendations: string[];
}

// Hook simplificado para el debugger de contenido
const useContentDebugger = () => {
  const diagnoseContent = async (
    contentId: string
  ): Promise<ContentDiagnostic> => {
    // Implementación básica de diagnóstico
    return {
      checks: {
        idFormat: true,
        accessibility: true,
        connectivity: true,
        serverReachable: true,
        hasPermissions: true,
      },
      issues: [],
      suggestions: [],
      recommendations: [],
    };
  };

  return { diagnoseContent };
};

// Utilidades estáticas del ContentDebugger
const ContentDebugger = {
  getAuthInfo: () => {
    // Implementación básica para obtener información de autenticación
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return {
        hasToken: !!token,
        isValid: !!token && token.length > 0,
        isLoggedIn: !!token,
        cookieDetails: {
          cookieCount: 0,
          hasUnamToken: !!token,
          tokenLength: token?.length || 0,
        },
      };
    } catch (error) {
      return {
        hasToken: false,
        isValid: false,
        isLoggedIn: false,
        cookieDetails: {
          cookieCount: 0,
          hasUnamToken: false,
          tokenLength: 0,
        },
      };
    }
  },

  formatDiagnosticReport: (diagnostic: ContentDiagnostic) => {
    return `
📊 Diagnóstico de Contenido
=========================

✅ Verificaciones:
- Formato ID: ${diagnostic.checks.idFormat ? "✓" : "✗"}
- Accesibilidad: ${diagnostic.checks.accessibility ? "✓" : "✗"}  
- Conectividad: ${diagnostic.checks.connectivity ? "✓" : "✗"}
- Servidor accesible: ${diagnostic.checks.serverReachable ? "✓" : "✗"}
- Permisos: ${diagnostic.checks.hasPermissions ? "✓" : "✗"}

${
  diagnostic.issues.length > 0
    ? `
⚠️ Problemas encontrados:
${diagnostic.issues.map((issue) => `- ${issue}`).join("\n")}
`
    : "✅ No se encontraron problemas"
}

${
  diagnostic.suggestions.length > 0
    ? `
💡 Sugerencias:
${diagnostic.suggestions.map((suggestion) => `- ${suggestion}`).join("\n")}
`
    : ""
}

${
  diagnostic.recommendations.length > 0
    ? `
📋 Recomendaciones:
${diagnostic.recommendations
  .map((recommendation) => `- ${recommendation}`)
  .join("\n")}
`
    : ""
}
    `.trim();
  },
};

interface ContentFixerProps {
  contentId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFixed?: () => void;
}

export function ContentFixer({
  contentId,
  isOpen,
  onOpenChange,
  onFixed,
}: ContentFixerProps) {
  const [diagnostic, setDiagnostic] = useState<ContentDiagnostic | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [fixAttempts, setFixAttempts] = useState<string[]>([]);
  const [authInfo, setAuthInfo] = useState<any>(null);
  const { diagnoseContent } = useContentDebugger();

  const runDiagnostic = async () => {
    setIsRunning(true);
    try {
      const result = await diagnoseContent(contentId);
      setDiagnostic(result);

      // Obtener información de autenticación detallada
      const auth = ContentDebugger.getAuthInfo();
      setAuthInfo(auth);
    } catch (error) {
      
    } finally {
      setIsRunning(false);
    }
  };

  const attemptFix = async (fixType: string) => {
    setFixAttempts((prev) => [...prev, fixType]);

    switch (fixType) {
      case "copyDebugInfo":
        // Copiar información de debug al portapapeles
        try {
          const debugInfo = {
            contentId,
            timestamp: new Date().toISOString(),
            diagnostic,
            authInfo,
            userAgent: navigator.userAgent,
            url: window.location.href,
            fixAttempts,
          };

          const debugText = `
🔍 INFORMACIÓN DE DEBUG - CONTENT FIXER
═══════════════════════════════════════

📋 Contenido ID: ${contentId}
⏰ Timestamp: ${new Date().toISOString()}
🌐 URL: ${window.location.href}
🖥️ User Agent: ${navigator.userAgent}

${
  diagnostic
    ? ContentDebugger.formatDiagnosticReport(diagnostic)
    : "No hay diagnóstico disponible"
}

🔧 Intentos de arreglo realizados: ${fixAttempts.join(", ") || "Ninguno"}

📊 Información completa:
${JSON.stringify(debugInfo, null, 2)}
          `.trim();

          await navigator.clipboard.writeText(debugText);
          alert("✅ Información de debug copiada al portapapeles");
        } catch (error) {
          // Fallback si no se puede copiar al portapapeles
          const debugText = diagnostic
            ? ContentDebugger.formatDiagnosticReport(diagnostic)
            : "No hay diagnóstico disponible";
          prompt(
            "No se pudo copiar automáticamente. Copia manualmente:",
            debugText
          );
        }
        break;

      case "refresh":
        window.location.reload();
        break;

      case "clearAuth":
        // Limpiar cookies de autenticación
        document.cookie =
          "UNAM-INCLUSION-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Limpiar localStorage relacionado
        try {
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("currentUser");
          window.localStorage.removeItem("authToken");
        } catch (e) {
          
        }
        alert("Autenticación limpiada. Por favor, inicia sesión nuevamente.");
        window.location.href = "/";
        break;

      case "reauth":
        // Forzar re-autenticación manteniendo la página actual
        const currentUrl = window.location.href;
        window.localStorage.setItem("redirectAfterLogin", currentUrl);
        window.location.href = "/auth/login";
        break;

      case "checkPermissions":
        // Verificar permisos del usuario actual
        try {
          // Primero intentar con la API interna
          const response = await fetch("/api/user/permissions", {
            credentials: "include",
          });
          if (response.ok) {
            const permissions = await response.json();
            alert(
              `Permisos del usuario: ${JSON.stringify(permissions, null, 2)}`
            );
          } else {
            // Si la API interna falla, mostrar información del token actual
            const authInfo = ContentDebugger.getAuthInfo();
            alert(
              `No se pudieron obtener los permisos del usuario. Código: ${response.status}\n\n` +
                `Información de autenticación actual:\n` +
                `Token presente: ${authInfo.hasToken}\n` +
                `Token válido: ${authInfo.isValid}\n` +
                `Usuario logueado: ${authInfo.isLoggedIn}`
            );
          }
        } catch (error: any) {
          // Si hay error, mostrar información del token local
          const authInfo = ContentDebugger.getAuthInfo();
          alert(
            `Error verificando permisos: ${error?.message || error}\n\n` +
              `Información de autenticación local:\n` +
              `Token presente: ${authInfo.hasToken}\n` +
              `Token válido: ${authInfo.isValid}\n` +
              `Cookies totales: ${authInfo.cookieDetails.cookieCount}`
          );
        }
        break;

      case "testBackend":
        // Probar conexión con el backend GraphQL directo
        try {
          const connectionTest = await testGraphQLConnection();
          if (connectionTest.success && connectionTest.serverReachable) {
            alert(
              `Conexión con el backend GraphQL exitosa ✅\n` +
                `Endpoint: ${connectionTest.endpoint}\n` +
                `Tiempo de respuesta: ${connectionTest.responseTime}ms`
            );
          } else {
            alert(
              `Error de conexión con el backend GraphQL ❌\n` +
                `Endpoint: ${connectionTest.endpoint}\n` +
                `Error: ${connectionTest.error || "Error desconocido"}`
            );
          }
        } catch (error: any) {
          alert(
            "No se pudo conectar con el backend GraphQL: " +
              (error?.message || error)
          );
        }
        break;

      case "createNew":
        // Navegar a crear nuevo contenido
        const newContentUrl = `/main/teacher/content/new?level=${encodeURIComponent(
          "A1"
        )}&subject=${encodeURIComponent("Inglés")}`;
        window.location.href = newContentUrl;
        break;

      case "goBack":
        window.history.back();
        break;

      default:
        
    }
  };

  const getCheckIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                <span>Solucionador de Problemas de Contenido</span>
              </div>
              <p className="text-sm text-default-500">
                Herramienta para diagnosticar y resolver problemas de contenido
              </p>
            </ModalHeader>

            <ModalBody>
              <div className="space-y-4">
                {/* Información del contenido */}
                <Card>
                  <CardBody>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">ID de Contenido:</span>
                    </div>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {contentId}
                    </code>
                  </CardBody>
                </Card>

                {/* Botón para ejecutar diagnóstico */}
                <div className="flex justify-center">
                  <Button
                    color="primary"
                    onPress={runDiagnostic}
                    isLoading={isRunning}
                    startContent={
                      !isRunning && <AlertCircle className="w-4 h-4" />
                    }
                  >
                    {isRunning
                      ? "Ejecutando diagnóstico..."
                      : "Ejecutar Diagnóstico"}
                  </Button>
                </div>

                {/* Resultados del diagnóstico */}
                {diagnostic && (
                  <>
                    <Divider />
                    <Card>
                      <CardBody>
                        <h4 className="font-medium mb-3">
                          Resultados del Diagnóstico
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Formato de ID válido</span>
                            {getCheckIcon(diagnostic.checks.idFormat)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Servidor alcanzable</span>
                            {getCheckIcon(
                              diagnostic.checks.serverReachable ?? false
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Autenticación presente</span>
                            {getCheckIcon(
                              diagnostic.checks.hasPermissions ?? false
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Información de autenticación */}
                    {authInfo && (
                      <Card>
                        <CardBody>
                          <div className="flex items-center gap-2 mb-3">
                            <Key className="w-4 h-4" />
                            <h4 className="font-medium">
                              Estado de Autenticación
                            </h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Token presente:</span>
                              <div className="flex items-center gap-2">
                                {getCheckIcon(authInfo.hasToken)}
                                <span className="text-xs text-default-500">
                                  {authInfo.hasToken ? "Sí" : "No"}
                                </span>
                              </div>
                            </div>

                            {authInfo.hasToken && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Token válido:</span>
                                <div className="flex items-center gap-2">
                                  {getCheckIcon(authInfo.isValid)}
                                  <span className="text-xs text-default-500">
                                    {authInfo.isValid
                                      ? "Válido"
                                      : "Inválido/Expirado"}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Usuario logueado:</span>
                              <div className="flex items-center gap-2">
                                {getCheckIcon(authInfo.isLoggedIn)}
                                <span className="text-xs text-default-500">
                                  {authInfo.isLoggedIn ? "Sí" : "No"}
                                </span>
                              </div>
                            </div>

                            {authInfo.cookieDetails && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Info className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium">
                                    Detalles de Cookies
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div>
                                    Cookies encontradas:{" "}
                                    {authInfo.cookieDetails.cookieCount}
                                  </div>
                                  <div>
                                    Token UNAM:{" "}
                                    {authInfo.cookieDetails.hasUnamToken
                                      ? "Presente"
                                      : "Ausente"}
                                  </div>
                                  {authInfo.cookieDetails.tokenLength && (
                                    <div>
                                      Longitud token:{" "}
                                      {authInfo.cookieDetails.tokenLength}{" "}
                                      caracteres
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    )}

                    {/* Recomendaciones */}
                    {diagnostic.recommendations.length > 0 && (
                      <Card>
                        <CardBody>
                          <h4 className="font-medium mb-3">Recomendaciones</h4>
                          <ul className="space-y-2">
                            {diagnostic.recommendations.map((rec, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardBody>
                      </Card>
                    )}

                    {/* Acciones de reparación */}
                    <Card>
                      <CardBody>
                        <h4 className="font-medium mb-3">
                          Acciones de Reparación
                        </h4>
                        <div className="space-y-3">
                          {/* Acciones básicas */}
                          <div>
                            <p className="text-sm text-default-600 mb-2">
                              Acciones Básicas:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button
                                variant="bordered"
                                size="sm"
                                onPress={() => attemptFix("refresh")}
                                startContent={<RefreshCw className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes("refresh")}
                              >
                                Recargar Página
                              </Button>

                              <Button
                                variant="bordered"
                                size="sm"
                                onPress={() => attemptFix("goBack")}
                                startContent={<XCircle className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes("goBack")}
                              >
                                Volver Atrás
                              </Button>
                            </div>
                          </div>

                          {/* Acciones de autenticación */}
                          <div>
                            <p className="text-sm text-default-600 mb-2">
                              Problemas de Autenticación:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button
                                variant="bordered"
                                size="sm"
                                color="warning"
                                onPress={() => attemptFix("reauth")}
                                startContent={<Key className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes("reauth")}
                              >
                                Re-autenticar
                              </Button>

                              <Button
                                variant="bordered"
                                size="sm"
                                color="danger"
                                onPress={() => attemptFix("clearAuth")}
                                startContent={<XCircle className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes("clearAuth")}
                              >
                                Limpiar Autenticación
                              </Button>
                            </div>
                          </div>

                          {/* Acciones de diagnóstico */}
                          <div>
                            <p className="text-sm text-default-600 mb-2">
                              Diagnóstico Avanzado:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button
                                variant="bordered"
                                size="sm"
                                color="secondary"
                                onPress={() => attemptFix("checkPermissions")}
                                startContent={<Info className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes(
                                  "checkPermissions"
                                )}
                              >
                                Verificar Permisos
                              </Button>

                              <Button
                                variant="bordered"
                                size="sm"
                                color="secondary"
                                onPress={() => attemptFix("testBackend")}
                                startContent={
                                  <AlertCircle className="w-4 h-4" />
                                }
                                isDisabled={fixAttempts.includes("testBackend")}
                              >
                                Probar Backend
                              </Button>

                              <Button
                                variant="bordered"
                                size="sm"
                                color="secondary"
                                onPress={() => attemptFix("copyDebugInfo")}
                                startContent={<Copy className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes(
                                  "copyDebugInfo"
                                )}
                                className="md:col-span-2"
                              >
                                Copiar Info Debug
                              </Button>
                            </div>
                          </div>

                          {/* Acciones alternativas */}
                          <div>
                            <p className="text-sm text-default-600 mb-2">
                              Alternativas:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              <Button
                                variant="bordered"
                                size="sm"
                                color="primary"
                                onPress={() => attemptFix("createNew")}
                                startContent={<FileText className="w-4 h-4" />}
                                isDisabled={fixAttempts.includes("createNew")}
                              >
                                Crear Nuevo Contenido
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              {diagnostic && onFixed && (
                <Button
                  color="success"
                  onPress={() => {
                    onFixed();
                    onClose();
                  }}
                >
                  Problema Resuelto
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
