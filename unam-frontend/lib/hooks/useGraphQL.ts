import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { GraphQLVariables } from '@/types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

interface UseGraphQLOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useGraphQL<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (
    query: string,
    variables?: GraphQLVariables,
    token?: string,
    options: UseGraphQLOptions<T> = {}
  ): Promise<T> => {
    const {
      onSuccess,
      onError,
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = 'Operación exitosa'
    } = options;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      onSuccess?.(result.data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      
      if (showErrorToast) {
        toast.error(error.message);
      }
      
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    execute,
    loading,
    error,
    clearError: () => setError(null)
  };
}

export default useGraphQL;