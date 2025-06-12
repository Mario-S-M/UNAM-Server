import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUser,
  blockUser,
  revalidateToken,
} from "../actions/user-actions";

// Query hooks
export function useUsers(token?: string) {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token),
    enabled: !!token,
  });
}

export function useUser(userId: string, token?: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId, token),
    enabled: !!userId && !!token,
  });
}

export function useRevalidateToken(token: string) {
  return useQuery({
    queryKey: ["auth", "revalidate", token],
    queryFn: () => revalidateToken(token),
    enabled: !!token,
    retry: false,
  });
}

// Mutation hooks
export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token?: string }) =>
      blockUser(id, token),
    onSuccess: () => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
