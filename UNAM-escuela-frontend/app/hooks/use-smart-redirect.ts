"use client";

import { AuthDAL, Role } from "@/app/dal/auth-dal";
import { User } from "@/app/interfaces/auth-interfaces";

/**
 * Hook para manejar redirecciones inteligentes después del login
 */
export function useSmartRedirect() {
  /**
   * Obtiene la ruta de redirección basada en el usuario y el rol más alto
   */
  const getRedirectPath = (user: User | null): string => {
    if (!user) {
      return "/auth/login";
    }

    if (!user.isActive) {
      return "/auth/inactive";
    }

    // Usar el DAL para obtener la página principal del usuario
    return AuthDAL.getUserMainPage(user);
  };

  /**
   * Retorna información detallada sobre la redirección
   */
  const getRedirectInfo = (user: User | null) => {
    const path = getRedirectPath(user);
    const role = AuthDAL.getHighestRole(user);
    const roleInfo = role ? AuthDAL.getRoleInfo(role) : null;

    return {
      path,
      role,
      roleInfo,
      displayName: roleInfo?.displayName || "Usuario",
      shouldRedirect: path !== "/auth/login",
    };
  };

  return {
    getRedirectPath,
    getRedirectInfo,
  };
}
