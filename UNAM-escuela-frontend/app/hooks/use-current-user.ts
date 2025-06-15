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
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache the data (was cacheTime in v4)
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export async function logoutAction() {
  await logoutServerAction();
  window.location.reload();
}
