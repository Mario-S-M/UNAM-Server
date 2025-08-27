'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Language, Level, PaginatedResponse } from '@/types';
import { Skill } from '@/skills/types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

const GET_SKILLS_PAGINATED = `
  query GetSkillsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean, $levelId: ID, $lenguageId: ID) {
    skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive, levelId: $levelId, lenguageId: $lenguageId) {
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
  levelId?: string;
  lenguageId?: string;
}

export interface UseSkillDataReturn {
  skills: PaginatedResponse<Skill>;
  languages: Language[];
  levels: Level[];
  loading: boolean;
  error: string | null;
  selectedLanguageId: string | undefined;
  selectedLevelId: string | undefined;
  setSelectedLanguageId: (languageId: string | undefined) => void;
  setSelectedLevelId: (levelId: string | undefined) => void;
  fetchSkills: (search?: string, page?: number, limit?: number, isActive?: boolean, levelId?: string, lenguageId?: string) => Promise<void>;
  fetchLanguages: () => Promise<void>;
  fetchLevelsByLanguage: (languageId: string) => Promise<void>;
}

export function useSkillData(authToken?: string): UseSkillDataReturn {
  const { token } = useAuth();
  const finalToken = authToken || token;
  
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
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | undefined>(undefined);
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);

  const fetchSkills = useCallback(async (
    search?: string,
    page: number = 1,
    limit: number = 5,
    isActive?: boolean,
    levelId?: string,
    lenguageId?: string
  ) => {
    if (!finalToken) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchGraphQL(
        GET_SKILLS_PAGINATED,
        {
          search: search || undefined,
          page,
          limit,
          isActive,
          levelId: levelId || undefined,
          lenguageId: lenguageId || undefined
        },
        finalToken
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
  }, [finalToken]);

  const fetchLanguages = useCallback(async () => {
    if (!finalToken) return;
    
    try {
      const data = await fetchGraphQL(GET_LANGUAGES, {}, finalToken);
      setLanguages(data.lenguagesActivate || []);
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  }, [finalToken]);

  const fetchLevelsByLanguage = useCallback(async (languageId: string) => {
    if (!finalToken || !languageId) {
      setLevels([]);
      return;
    }
    
    try {
      const data = await fetchGraphQL(
        GET_LEVELS_BY_LANGUAGE,
        { lenguageId: languageId },
        finalToken
      );
      setLevels(data.levelsByLenguage || []);
    } catch (err) {
      console.error('Error fetching levels:', err);
      setLevels([]);
    }
  }, [finalToken]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    skills,
    languages,
    levels,
    loading,
    error,
    selectedLanguageId,
    selectedLevelId,
    setSelectedLanguageId,
    setSelectedLevelId,
    fetchSkills,
    fetchLanguages,
    fetchLevelsByLanguage
  };
}

export default useSkillData;