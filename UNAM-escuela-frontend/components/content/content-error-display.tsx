"use client";

import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  Home,
  Lock,
  Wifi,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ContentErrorHandler,
  ErrorInfo,
} from "@/app/utils/content-error-handler";

interface ContentErrorDisplayProps {
  error: string;
  errorInfo?: ErrorInfo;
  onRetry?: () => void;
  showBackButton?: boolean;
  backUrl?: string;
  context?: string;
}

export function ContentErrorDisplay({
  error,
  errorInfo,
  onRetry,
  showBackButton = true,
  backUrl = "/main/teacher/content",
  context = "contenido",
}: ContentErrorDisplayProps) {
  const router = useRouter();

  console.log("🔍 ContentErrorDisplay - Props:", {
    error,
    errorInfo,
    context,
    showBackButton,
    backUrl,
  });

  // Si no tenemos errorInfo, analizamos el error
  const analyzedError =
    errorInfo || ContentErrorHandler.analyzeError({ message: error });

  const getErrorIcon = () => {
    switch (analyzedError.type) {
      case "NOT_FOUND_ERROR":
        return <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />;
      case "AUTHENTICATION_ERROR":
        return <Lock className="h-16 w-16 text-red-400 mx-auto mb-4" />;
      case "PERMISSION_ERROR":
        return <Lock className="h-16 w-16 text-orange-400 mx-auto mb-4" />;
      case "NETWORK_ERROR":
        return <Wifi className="h-16 w-16 text-blue-400 mx-auto mb-4" />;
      case "VALIDATION_ERROR":
        return (
          <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        );
      default:
        return <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />;
    }
  };

  const getErrorTitle = () => {
    switch (analyzedError.type) {
      case "NOT_FOUND_ERROR":
        return "Contenido no encontrado";
      case "AUTHENTICATION_ERROR":
        return "Sesión expirada";
      case "PERMISSION_ERROR":
        return "Acceso denegado";
      case "NETWORK_ERROR":
        return "Error de conexión";
      case "VALIDATION_ERROR":
        return "Datos inválidos";
      case "SERVER_ERROR":
        return "Error del servidor";
      default:
        return "Error inesperado";
    }
  };

  const getErrorColor = () => {
    switch (analyzedError.type) {
      case "NOT_FOUND_ERROR":
        return "default";
      case "AUTHENTICATION_ERROR":
      case "PERMISSION_ERROR":
        return "danger";
      case "NETWORK_ERROR":
        return "primary";
      case "VALIDATION_ERROR":
        return "warning";
      case "SERVER_ERROR":
        return "danger";
      default:
        return "danger";
    }
  };

  const isRecoverable = ContentErrorHandler.isRecoverableError(analyzedError);

  const handleGoHome = () => {
    router.push("/main/teacher");
  };

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-2xl w-full">
        <CardBody className="text-center">
          {getErrorIcon()}

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {getErrorTitle()}
          </h3>

          <Chip
            color={getErrorColor()}
            variant="flat"
            size="sm"
            className="mb-4"
          >
            {analyzedError.type.replace("_", " ")}
          </Chip>

          <p className="text-gray-600 mb-4">{analyzedError.message}</p>

          {analyzedError.suggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>💡 Sugerencia:</strong> {analyzedError.suggestion}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Botón de reintentar para errores recuperables */}
            {isRecoverable && onRetry && (
              <Button
                color="primary"
                variant="solid"
                onClick={onRetry}
                startContent={<RefreshCw className="h-4 w-4" />}
              >
                Reintentar
              </Button>
            )}

            {/* Botón de login para errores de autenticación */}
            {analyzedError.type === "AUTHENTICATION_ERROR" && (
              <Button
                color="primary"
                variant="solid"
                onClick={handleLogin}
                startContent={<Lock className="h-4 w-4" />}
              >
                Iniciar sesión
              </Button>
            )}

            {/* Botón de volver */}
            {showBackButton && (
              <Link href={backUrl}>
                <Button
                  color="default"
                  variant="light"
                  startContent={<ArrowLeft className="h-4 w-4" />}
                >
                  Volver al {context}
                </Button>
              </Link>
            )}

            {/* Botón de inicio */}
            <Button
              color="default"
              variant="light"
              onClick={handleGoHome}
              startContent={<Home className="h-4 w-4" />}
            >
              Ir al inicio
            </Button>
          </div>

          {/* Información de debugging en desarrollo */}
          {process.env.NODE_ENV === "development" &&
            analyzedError.originalError && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Información de debugging
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(analyzedError.originalError, null, 2)}
                </pre>
              </details>
            )}
        </CardBody>
      </Card>
    </div>
  );
}

// Componente específico para errores de contenido no encontrado
export function ContentNotFoundError({
  contentId,
  onRetry,
}: {
  contentId?: string;
  onRetry?: () => void;
}) {
  return (
    <ContentErrorDisplay
      error="El contenido solicitado no fue encontrado"
      errorInfo={{
        type: "NOT_FOUND_ERROR",
        message: contentId
          ? `El contenido con ID "${contentId}" no existe o no tienes permisos para acceder a él`
          : "El contenido solicitado no fue encontrado",
        suggestion:
          "Verifica que el enlace sea correcto y que tengas los permisos necesarios para acceder al contenido",
      }}
      onRetry={onRetry}
      context="contenido"
    />
  );
}

// Componente específico para errores de autenticación
export function AuthenticationError() {
  return (
    <ContentErrorDisplay
      error="Tu sesión ha expirado"
      errorInfo={{
        type: "AUTHENTICATION_ERROR",
        message: "Necesitas iniciar sesión para acceder a este contenido",
        suggestion: 'Haz clic en "Iniciar sesión" para acceder a tu cuenta',
      }}
      showBackButton={false}
      context="sistema"
    />
  );
}
