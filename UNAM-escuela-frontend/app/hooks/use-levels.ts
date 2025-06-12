import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLevelsByLenguage,
  getLevel,
  createLevel,
  deleteLevel,
} from "../actions/level-actions";

// Query hooks
export function useLevelsByLanguage(languageId: string) {
  return useQuery({
    queryKey: ["levels", "by-language", languageId],
    queryFn: () => getLevelsByLenguage(languageId),
    enabled: !!languageId,
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
