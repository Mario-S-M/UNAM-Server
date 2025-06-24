"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthError } from "@/components/providers/auth-error-provider";

/**
 * Component that monitors for auth errors and triggers the blocked user modal
 * Must be placed inside AuthErrorProvider
 */
export function AuthErrorMonitor() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthError();

  useEffect(() => {
    // Monitor the currentUser query for errors
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.query.queryKey[0] === "currentUser"
      ) {
        const query = event.query;
        if (query.state.error) {
          // Check if it's a blocked user error
          const error = query.state.error as any;
          handleAuthError(error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, handleAuthError]);

  // This component doesn't render anything
  return null;
}
