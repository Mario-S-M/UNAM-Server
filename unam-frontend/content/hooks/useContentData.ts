import { useQuery } from '@apollo/client';
import { GET_CONTENTS, GET_LEVELS, GET_SKILLS, GET_TEACHERS } from '@/lib/graphql/queries';
import { Content, Level, Skill, Teacher, PaginatedContents } from '../../types';

interface UseContentDataProps {
  currentPage: number;
  pageSize: number;
}

interface UseContentDataReturn {
  // Data
  contents: Content[];
  levels: Level[];
  skills: Skill[];
  teachers: Teacher[];
  totalPages: number;
  totalItems: number;
  meta: PaginatedContents | undefined;
  
  // Loading states
  contentsLoading: boolean;
  levelsLoading: boolean;
  skillsLoading: boolean;
  teachersLoading: boolean;
  
  // Actions
  refetchContents: () => void;
}

export function useContentData({ currentPage, pageSize }: UseContentDataProps): UseContentDataReturn {
  // Queries
  const { 
    data: contentsData, 
    loading: contentsLoading, 
    refetch: refetchContents 
  } = useQuery<PaginatedContents>(GET_CONTENTS, {
    variables: {
      page: currentPage,
      limit: pageSize
    }
  });
  
  const { data: levelsData, loading: levelsLoading } = useQuery(GET_LEVELS);
  
  const { 
    data: skillsData, 
    loading: skillsLoading 
  } = useQuery(GET_SKILLS, {
    variables: {
      page: 1,
      limit: 100
    }
  });
  
  const { data: teachersData, loading: teachersLoading } = useQuery(GET_TEACHERS);

  // Derived data
  const contents: Content[] = contentsData?.contents || [];
  const levels: Level[] = levelsData?.levels || [];
  const skills: Skill[] = skillsData?.skills || [];
  const teachers: Teacher[] = teachersData?.teachers || [];
  const totalPages = Math.ceil((contentsData?.total || 0) / pageSize);
  const totalItems = contentsData?.total || 0;
  const meta = contentsData;

  return {
    // Data
    contents,
    levels,
    skills,
    teachers,
    totalPages,
    totalItems,
    meta,
    
    // Loading states
    contentsLoading,
    levelsLoading,
    skillsLoading,
    teachersLoading,
    
    // Actions
    refetchContents
  };
}

export default useContentData;