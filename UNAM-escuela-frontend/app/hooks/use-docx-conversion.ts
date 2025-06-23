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
      console.log("🚀 useDocxConversion mutation started");
      console.log("📋 Content ID:", contentId);
      console.log(
        "📄 File:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );

      try {
        const result = await convertDocxToMarkdown(contentId, file);
        console.log("✅ convertDocxToMarkdown completed, result:", result);
        return result;
      } catch (error) {
        console.error("💥 Error in useDocxConversion:", error);
        throw error;
      }
    },
    onSuccess: (result, { contentId }) => {
      console.log("🎉 Mutation succeeded, invalidating queries...");
      console.log("📊 Success data:", result);

      // Invalidate and refetch markdown content for this specific content
      queryClient.invalidateQueries({
        queryKey: ["contentMarkdown", contentId],
      });
      // Also invalidate the content itself to update any metadata
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });

      console.log("✅ Queries invalidated");
    },
    onError: (error, variables) => {
      console.error("❌ Mutation failed:", error);
      console.error("📋 Failed for content:", variables.contentId);
    },
  });
}
