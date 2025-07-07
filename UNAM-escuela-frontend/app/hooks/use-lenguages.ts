import { useQuery } from "@tanstack/react-query";
import {
  getLanguagesList,
  getLanguageById,
  getLanguagesListPublic,
} from "../actions/lenguage-actions";
import { Lenguage } from "../interfaces/lenguage-interfaces";

// Query hooks
export function useActiveLenguages(requireAuth: boolean = true) {
  return useQuery({
    queryKey: ["lenguages", "active", requireAuth ? "auth" : "public"],
    queryFn: async () => {
      const result = requireAuth
        ? await getLanguagesList()
        : await getLanguagesListPublic();

      if (!result.success) {
        throw new Error(result.error || "Error al cargar idiomas");
      }

      // Filtrar solo idiomas activos
      return result.data.filter((language: Lenguage) => language.isActive);
    },
    retry: (failureCount, error: any) => {
      // No reintentar si es error de autenticación
      if (
        error?.message?.includes("No hay token disponible") ||
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
    queryFn: async () => {
      const result = await getLanguageById(id);

      if (!result.success) {
        throw new Error(result.error || "Error al cargar idioma");
      }

      return result.data;
    },
    enabled: !!id,
  });
}
