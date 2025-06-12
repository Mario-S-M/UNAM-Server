import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentsByLevel,
  getContent,
  createContent,
  updateContent,
  deleteContent,
} from "../actions/content-actions";

// Query hooks
export function useContentsByLevel(levelId: string) {
  return useQuery({
    queryKey: ["contents", "by-level", levelId],
    queryFn: () => getContentsByLevel(levelId),
    enabled: !!levelId,
  });
}

export function useContent(contentId: string) {
  return useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContent(contentId),
    enabled: !!contentId,
  });
}

// Mutation hooks
export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      // Invalidate and refetch contents queries
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateContent(id, formData),
    onSuccess: () => {
      // Invalidate and refetch contents queries
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      // Invalidate and refetch contents queries
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}
