import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLevelsByLenguage,
  getLevelsByLenguagePublic,
  getLevel,
  createLevel,
  updateLevel,
  deleteLevel,
} from "../actions/level-actions";

// Query hooks
export function useLevelsByLanguage(
  languageId: string,
  requireAuth: boolean = true
) {
  return useQuery({
    queryKey: [
      "levels",
      "by-language",
      languageId,
      requireAuth ? "auth" : "public",
    ],
    queryFn: async () => {
      if (requireAuth) {
        try {
          return await getLevelsByLenguage(languageId);
        } catch (error: any) {
          // Si hay error de autenticación, intentar con versión pública
          if (
            error.message?.includes("Unauthorized") ||
            error.message?.includes("UNAUTHENTICATED") ||
            error.message?.includes("token")
          ) {
            // Silently fall back to public version for better UX
            return await getLevelsByLenguagePublic(languageId);
          }
          throw error;
        }
      } else {
        return await getLevelsByLenguagePublic(languageId);
      }
    },
    enabled: !!languageId,
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

export function useLevel(levelId: string) {
  return useQuery({
    queryKey: ["level", levelId],
    queryFn: () => getLevel(levelId),
    enabled: !!levelId,
  });
}

// Mutation hooks
export function useCreateLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLevel,
    onSuccess: () => {
      // Invalidate and refetch levels queries
      queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
}

export function useUpdateLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateLevel(id, formData),
    onSuccess: () => {
      // Invalidate and refetch levels queries
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      queryClient.invalidateQueries({ queryKey: ["level"] });
    },
  });
}

export function useDeleteLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => {
      // Invalidate and refetch levels queries
      queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
}
