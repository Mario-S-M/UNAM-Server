import { useQuery } from "@tanstack/react-query";
import {
  getActiveLenguages,
  getActiveLenguagesPublic,
  getLanguageById,
} from "../actions/lenguage-actions";

// Query hooks
export function useActiveLenguages(requireAuth: boolean = true) {
  return useQuery({
    queryKey: ["lenguages", "active", requireAuth ? "auth" : "public"],
    queryFn: async () => {
      if (requireAuth) {
        try {
          return await getActiveLenguages();
        } catch (error: any) {
          // Si hay error de autenticación, intentar con versión pública
          if (
            error.message?.includes("Unauthorized") ||
            error.message?.includes("UNAUTHENTICATED") ||
            error.message?.includes("token")
          ) {
            // Silently fall back to public version for better UX
            return await getActiveLenguagesPublic();
          }
          throw error;
        }
      } else {
        return await getActiveLenguagesPublic();
      }
    },
    retry: (failureCount, error: any) => {
      // No reintentar si es error de autenticación
      if (
        error?.message?.includes("Unauthorized") ||
        error?.message?.includes("UNAUTHENTICATED")
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useLanguageById(id: string) {
  return useQuery({
    queryKey: ["lenguage", id],
    queryFn: () => getLanguageById(id),
    enabled: !!id,
  });
}
