'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Language, Level } from '@/types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3002/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple console log for now - replace with actual toast implementation
  if (type === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
};

// GraphQL fetch function
const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
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
    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

// GraphQL Queries
const GET_LEVELS_PAGINATED = `
  query GetLevelsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean, $lenguageId: ID, $difficulty: String) {
    levelsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive, lenguageId: $lenguageId, difficulty: $difficulty) {
      levels {
        id
        name
        description
        difficulty
        isActive
        lenguageId
        lenguage {
          id
          name
        }
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

const GET_LANGUAGES = `
  query GetLanguages {
    lenguagesActivate {
      id
      name
    }
  }
`;

interface PaginatedLevels {
  levels: Level[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseLevelDataProps {
  search: string;
  currentPage: number;
  pageSize: number;
  activeFilter?: boolean;
  languageFilter: string;
  difficultyFilter: string;
}

interface UseLevelDataReturn {
  levels: PaginatedLevels;
  languages: Language[];
  loading: boolean;
  refetchLevels: () => Promise<void>;
  refetchLanguages: () => Promise<void>;
}

export function useLevelData({
  search,
  currentPage,
  pageSize,
  activeFilter,
  languageFilter,
  difficultyFilter,
}: UseLevelDataProps): UseLevelDataReturn {
  const { token } = useAuth();
  const [levels, setLevels] = useState<PaginatedLevels>({
    levels: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const data = await fetchGraphQL(
        GET_LEVELS_PAGINATED,
        {
          search: search || undefined,
          page: currentPage,
          limit: pageSize,
          isActive: activeFilter,
          lenguageId: languageFilter || undefined,
          difficulty: difficultyFilter || undefined,
        },
        token || undefined
      );
      setLevels(data.levelsPaginated);
    } catch (error) {
      console.error('Error fetching levels:', error);
      showToast('Error al cargar los niveles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const data = await fetchGraphQL(
        GET_LANGUAGES,
        {},
        token || undefined
      );
      setLanguages(data.lenguagesActivate);
    } catch (error) {
      console.error('Error fetching languages:', error);
      showToast('Error al cargar los idiomas', 'error');
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [currentPage, pageSize, search, activeFilter, languageFilter, difficultyFilter]);

  return {
    levels,
    languages,
    loading,
    refetchLevels: fetchLevels,
    refetchLanguages: fetchLanguages,
  };
}

export type { UseLevelDataProps, UseLevelDataReturn, PaginatedLevels };