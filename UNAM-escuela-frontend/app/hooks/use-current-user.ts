"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, logoutServerAction } from "@/app/actions/auth";

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      console.log("🔍 useCurrentUser - Ejecutando getCurrentUser...");
      const result = await getCurrentUser();
      console.log("📋 useCurrentUser - Resultado:", {
        hasUser: !!result,
        userId: result?.id,
        userRoles: result?.roles,
      });
      return result;
    },
    staleTime: 1000 * 60 * 2, // Reducir a 2 minutos para mejor detección de cambios
    gcTime: 1000 * 60 * 10, // 10 minutos cache
    retry: (failureCount, error) => {
      console.log("🔄 useCurrentUser - Retry attempt:", {
        failureCount,
        error: error?.message,
        maxRetries: 3,
      });
      return failureCount < 3; // Aumentar a 3 reintentos
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 5000); // Exponential backoff, max 5s
      console.log(`⏱️ useCurrentUser - Retry delay: ${delay}ms`);
      return delay;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Configuración específica para producción
    networkMode: "online",
    // Usar refetchInterval en producción para detectar pérdida de cookies
    refetchInterval:
      process.env.NODE_ENV === "production" ? 1000 * 60 * 2 : false, // Cada 2 minutos en producción
  });
}

export async function logoutAction() {
  await logoutServerAction();
  window.location.reload();
}
