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
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos cache
    retry: (failureCount, error) => {
      console.log("🔄 useCurrentUser - Retry attempt:", failureCount, error);
      return failureCount < 2; // Máximo 2 reintentos
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Deshabilitar para evitar bucles
    refetchOnReconnect: true,
    networkMode: "online",
    // DESHABILITADO: refetchInterval puede causar bucles infinitos
    refetchInterval: false,
  });
}

export async function logoutAction() {
  await logoutServerAction();
  window.location.reload();
}
