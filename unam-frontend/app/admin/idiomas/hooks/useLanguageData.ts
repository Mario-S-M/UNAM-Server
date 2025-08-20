import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageEntity, PaginatedLanguages } from '@/types';
import { toast } from 'sonner';

interface UseLanguageDataProps {
  search: string;
  currentPage: number;
  pageSize: number;
  activeFilter: string;
}

interface UseLanguageDataReturn {
  languages: LanguageEntity[];
  loading: boolean;
  error: string | null;
  paginationInfo: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  refetch: () => Promise<void>;
}

const GET_LANGUAGES_PAGINATED = `
  query GetLanguagesPaginated($page: Int!, $limit: Int!, $search: String, $filter: String) {
    getLanguagesPaginated(page: $page, limit: $limit, search: $search, filter: $filter) {
      lenguages {
        id
        name
        code
        nativeName
        flag
        icons
        isActive
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

const fetchGraphQL = async (query: string, variables: Record<string, any>, token: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'Error en la consulta GraphQL');
  }

  return result.data;
};

export function useLanguageData({
  search,
  currentPage,
  pageSize,
  activeFilter
}: UseLanguageDataProps): UseLanguageDataReturn {
  const { token } = useAuth();
  const [languages, setLanguages] = useState<LanguageEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchLanguages = useCallback(async () => {
    if (!token) {
      setError('Token de autenticación no disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const variables = {
        page: currentPage,
        limit: pageSize,
        search: search.trim() || undefined,
        filter: activeFilter !== 'all' ? activeFilter : undefined
      };

      const data = await fetchGraphQL(GET_LANGUAGES_PAGINATED, variables, token);
      const result: PaginatedLanguages = data.getLanguagesPaginated;

      setLanguages(result.lenguages || []);
      setPaginationInfo({
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(`Error al cargar idiomas: ${errorMessage}`);
      console.error('Error fetching languages:', err);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, pageSize, search, activeFilter]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const refetch = useCallback(async () => {
    await fetchLanguages();
  }, [fetchLanguages]);

  return {
    languages,
    loading,
    error,
    paginationInfo,
    refetch
  };
}

export default useLanguageData;