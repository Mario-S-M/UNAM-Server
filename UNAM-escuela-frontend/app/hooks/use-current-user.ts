"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logoutServerAction } from "@/app/actions/auth";
import { AuthenticatedUser } from "@/app/schemas";

export type User = AuthenticatedUser;

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 30, // Reducir a 30 segundos
    gcTime: 1000 * 60 * 5, // Reducir a 5 minutos cache
    retry: (failureCount, error: any) => {
      // Don't retry if it's a blocked user error - let QueryClient handle it
      if (
        error?.message?.includes("Usuario no activo") ||
        error?.message?.includes("Usuario inactivo") ||
        (error as any)?.extensions?.code === "UNAUTHENTICATED"
      ) {
        return false;
      }

      // No reintentar si no hay token (usuario no autenticado)
      if (error?.message?.includes("No hay token disponible")) {
        return false;
      }

      return failureCount < 2; // Máximo 2 reintentos
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true, // Habilitar para detectar cambios
    refetchOnReconnect: true,
    networkMode: "online",
    // DESHABILITADO: refetchInterval puede causar bucles infinitos
    refetchInterval: false,
    // Configurar para que no muestre error cuando no hay usuario (es normal)
    throwOnError: false,
    // NO establecer initialData como null para evitar problemas de estado
    // initialData: null,
  });
}

export async function logoutAction() {
  // Eliminar cookie del servidor
  await logoutServerAction();

  // Redirigir a la página raíz inmediatamente
  // El cache se limpiará automáticamente cuando se recargue la página
  window.location.href = "/";
}
