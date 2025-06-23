import { useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDocxToMarkdown } from "../actions/content-actions";

export function useDocxConversion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      file,
    }: {
      contentId: string;
      file: File;
    }) => {
      try {
        const result = await convertDocxToMarkdown(contentId, file);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (result, { contentId }) => {
      // Invalidate and refetch markdown content for this specific content
      queryClient.invalidateQueries({
        queryKey: ["contentMarkdown", contentId],
      });
      // Also invalidate the content itself to update any metadata
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
    },
    onError: (error, variables) => {
      // Error handling logic (no console output)
    },
  });
}
