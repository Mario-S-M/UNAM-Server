import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActivitiesByContent,
  getAllActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../actions/activity-actions";

// Query hooks
export function useActivitiesByContent(contentId: string) {
  return useQuery({
    queryKey: ["activities", "by-content", contentId],
    queryFn: () => getActivitiesByContent(contentId),
    enabled: !!contentId,
  });
}

export function useAllActivities() {
  return useQuery({
    queryKey: ["activities", "all"],
    queryFn: getAllActivities,
  });
}

export function useActivity(activityId: string) {
  return useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => getActivity(activityId),
    enabled: !!activityId,
  });
}

// Mutation hooks
export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      // Invalidate and refetch activities queries
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateActivity(id, formData),
    onSuccess: () => {
      // Invalidate and refetch activities queries
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      // Invalidate and refetch activities queries
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}
