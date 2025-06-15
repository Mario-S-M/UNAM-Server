"use client";

import { usePageProtection } from "@/app/hooks/use-authorization";
import { ReactNode } from "react";

interface RouteGuardProps {
  children: ReactNode;
  requiredPage: string;
  fallback?: ReactNode;
  showLoadingSpinner?: boolean;
}

/**
 * Componente que protege rutas usando el DAL de autorización
 */
export function RouteGuard({
  children,
  requiredPage,
  fallback,
  showLoadingSpinner = true,
}: RouteGuardProps) {
  const { isLoading, isAuthorized, authorizationResult } =
    usePageProtection(requiredPage);

  // Mostrar loading mientras se verifica la autorización
  if (isLoading) {
    if (!showLoadingSpinner) return null;

    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, mostrar fallback o no mostrar nada
  if (isAuthorized === false) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Mostrar mensaje de acceso denegado si no hay redirección
    if (!authorizationResult?.redirectTo) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 mb-2">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-red-800 font-semibold mb-2">Acceso Denegado</h3>
            <p className="text-red-700 text-sm">
              {authorizationResult?.reason ||
                "No tienes permisos para acceder a esta página"}
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>;
}

/**
 * HOC para proteger páginas completas
 */
export function withRouteGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPage: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <RouteGuard requiredPage={requiredPage}>
        <WrappedComponent {...props} />
      </RouteGuard>
    );
  };
}
