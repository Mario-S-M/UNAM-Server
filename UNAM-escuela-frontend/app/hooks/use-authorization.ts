"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AuthDAL, Role, AuthorizationResult } from "@/app/dal/auth-dal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Hook personalizado para manejar autorización usando el DAL
 */
export function useAuthorization() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Normalizar el usuario para asegurar que nunca sea undefined
  const safeUser = user === undefined ? null : user;

  return {
    user: safeUser,
    isLoading,

    // Verificar permisos
    hasPermission: (permission: string) =>
      AuthDAL.hasPermission(safeUser, permission),
    hasAnyRole: (roles: Role[]) => AuthDAL.hasAnyRole(safeUser, roles),
    canAccessPage: (page: string) => AuthDAL.canAccessPage(safeUser, page),
    canManageUser: (targetUser: any) =>
      AuthDAL.canManageUser(safeUser, targetUser),
    canPerformOperation: (
      operation: "create" | "read" | "update" | "delete",
      resource: string
    ) => AuthDAL.canPerformOperation(safeUser, operation, resource),

    // Información del usuario
    getHighestRole: () => AuthDAL.getHighestRole(safeUser),
    getUserMainPage: () => AuthDAL.getUserMainPage(safeUser),
    getRoleInfo: (role: Role) => AuthDAL.getRoleInfo(role),

    // Navegación
    redirectToMainPage: () => {
      const mainPage = AuthDAL.getUserMainPage(safeUser);
      router.push(mainPage);
    },

    redirectToAccessDenied: (reason?: string) => {
      console.warn("Acceso denegado:", reason);
      const mainPage = AuthDAL.getUserMainPage(safeUser);
      router.push(mainPage);
    },
  };
}

/**
 * Hook para proteger páginas específicas
 */
export function usePageProtection(pagePath: string) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authorizationResult, setAuthorizationResult] =
    useState<AuthorizationResult | null>(null);

  useEffect(() => {
    // Esperar a que termine de cargar
    if (isLoading) return;

    // Normalizar el usuario
    const safeUser = user === undefined ? null : user;
    const result = AuthDAL.canAccessPage(safeUser, pagePath);
    setAuthorizationResult(result);
    setIsAuthorized(result.hasAccess);

    // Si no tiene acceso, redirigir
    if (!result.hasAccess && result.redirectTo) {
      console.warn(
        `Redirigiendo de ${pagePath} a ${result.redirectTo}: ${result.reason}`
      );
      router.push(result.redirectTo);
    }
  }, [user, isLoading, pagePath, router]);

  return {
    isLoading,
    isAuthorized,
    authorizationResult,
    user: user === undefined ? null : user,
  };
}

/**
 * Hook para verificar permisos específicos en componentes
 */
export function usePermissions() {
  const { user } = useAuth();

  // Normalizar el usuario para asegurar que nunca sea undefined
  const safeUser = user === undefined ? null : user;

  return {
    // Permisos de administración
    canAccessAdminPanel: AuthDAL.hasAnyRole(safeUser, ["superUser", "admin"]),
    canAccessDebugPanel: AuthDAL.hasPermission(safeUser, "debug"),
    canManageUsers: AuthDAL.hasPermission(safeUser, "user_management"),
    canManageContent: AuthDAL.hasPermission(safeUser, "content_management"),
    canManageSkills: AuthDAL.hasAnyRole(safeUser, ["superUser", "admin"]),

    // Permisos de maestro
    canTeach: AuthDAL.hasPermission(safeUser, "teacher"),
    canViewContent: AuthDAL.hasPermission(safeUser, "content_view"),

    // Permisos de estudiante
    canStudy: AuthDAL.hasPermission(safeUser, "student"),

    // Información del usuario
    userRole: AuthDAL.getHighestRole(safeUser),
    userMainPage: AuthDAL.getUserMainPage(safeUser),

    // Verificaciones dinámicas
    hasPermission: (permission: string) =>
      AuthDAL.hasPermission(safeUser, permission),
    hasRole: (role: Role) => AuthDAL.hasAnyRole(safeUser, [role]),
    canPerformOperation: (
      operation: "create" | "read" | "update" | "delete",
      resource: string
    ) => AuthDAL.canPerformOperation(safeUser, operation, resource),
  };
}
