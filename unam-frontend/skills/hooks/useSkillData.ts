import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PaginatedSkills, Language, Level, GraphQLVariables } from '../types';

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

// Función helper para manejar errores
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
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
  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
};

export const useSkillData = (token?: string) => {
  const [skills, setSkills] = useState<PaginatedSkills>({
    skills: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');

  const fetchSkills = useCallback(async (
    search?: string,
    page: number = 1,
    limit: number = 5,
    isActive?: boolean
  ) => {
    try {
      setLoading(true);
      const data = await fetchGraphQL(
        GET_SKILLS_PAGINATED,
        {
          search: search || undefined,
          page,
          limit,
          isActive,
        },
        token || undefined
      );
      setSkills(data.skillsPaginated);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Error al cargar las habilidades');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchLanguages = useCallback(async () => {
    try {
      const data = await fetchGraphQL(GET_LANGUAGES, {}, token || undefined);
      setLanguages(data.lenguagesActivate);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error al cargar los idiomas');
    }
  }, [token]);

  const fetchLevelsByLanguage = useCallback(async (languageId: string) => {
    if (!languageId) {
      setLevels([]);
      return;
    }
    try {
      const data = await fetchGraphQL(
        GET_LEVELS_BY_LANGUAGE,
        { lenguageId: languageId },
        token || undefined
      );
      setLevels(data.levelsByLenguage);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Error al cargar los niveles');
    }
  }, [token]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    skills,
    languages,
    levels,
    loading,
    selectedLanguageId,
    setSelectedLanguageId,
    fetchSkills,
    fetchLanguages,
    fetchLevelsByLanguage,
    setLevels
  };
};