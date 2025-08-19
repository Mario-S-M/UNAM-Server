'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Skill, Language, Level, PaginatedResponse } from '@/types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

const GET_SKILLS_PAGINATED = `
  query GetSkillsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean) {
    skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive) {
      skills {
        id
        name
        description
        color
        imageUrl
        icon
        objectives
        prerequisites
        difficulty
        estimatedHours
        tags
        isActive
        levelId
        lenguageId
        level {
          id
          name
          description
          difficulty
        }
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

const GET_LEVELS_BY_LANGUAGE = `
  query GetLevelsByLanguage($lenguageId: ID!) {
    levelsByLenguage(lenguageId: $lenguageId) {
      id
      name
      description
      difficulty
    }
  }
`;

interface GraphQLVariables {
  [key: string]: string | number | boolean | null | undefined | string[];
}

const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
};

export interface UseSkillDataProps {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface UseSkillDataReturn {
  skills: PaginatedResponse<Skill>;
  languages: Language[];
  levels: Level[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchLevelsByLanguage: (languageId: string) => Promise<void>;
}

export function useSkillData({
  search = '',
  page = 1,
  limit = 5,
  isActive
}: UseSkillDataProps = {}): UseSkillDataReturn {
  const { token } = useAuth();
  
  const [skills, setSkills] = useState<PaginatedResponse<Skill>>({
    data: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchGraphQL(
        GET_SKILLS_PAGINATED,
        {
          search: search || undefined,
          page,
          limit,
          isActive
        },
        token
      );
      
      const skillsData = data.skillsPaginated;
      setSkills({
        data: skillsData.skills,
        total: skillsData.total,
        page: skillsData.page,
        limit: skillsData.limit,
        totalPages: skillsData.totalPages,
        hasNextPage: skillsData.hasNextPage,
        hasPreviousPage: skillsData.hasPreviousPage,
      });
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [token, search, page, limit, isActive]);

  const fetchLanguages = useCallback(async () => {
    if (!token) return;
    
    try {
      const data = await fetchGraphQL(GET_LANGUAGES, {}, token);
      setLanguages(data.lenguagesActivate || []);
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  }, [token]);

  const fetchLevelsByLanguage = useCallback(async (languageId: string) => {
    if (!token || !languageId) {
      setLevels([]);
      return;
    }
    
    try {
      const data = await fetchGraphQL(
        GET_LEVELS_BY_LANGUAGE,
        { lenguageId: languageId },
        token
      );
      setLevels(data.levelsByLenguage || []);
    } catch (err) {
      console.error('Error fetching levels:', err);
      setLevels([]);
    }
  }, [token]);

  const refetch = useCallback(async () => {
    await Promise.all([
      fetchSkills(),
      fetchLanguages()
    ]);
  }, [fetchSkills, fetchLanguages]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    skills,
    languages,
    levels,
    loading,
    error,
    refetch,
    fetchLevelsByLanguage
  };
}

export default useSkillData;