import { useQuery } from '@apollo/client';
import { GET_USER_PROGRESS, GET_USER_ACTIVITY_HISTORY, GET_USER_OVERALL_PROGRESS } from '../graphql/user-progress';

export interface UserProgress {
  id: string;
  userId: string;
  contentId: string;
  completedActivities: number;
  totalActivities: number;
  progressPercentage: number;
  lastActivityDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserActivityHistory {
  id: string;
  userId: string;
  activityId: string;
  contentId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  activity: {
    id: string;
    name: string;
    description?: string;
  };
  content: {
    id: string;
    title: string;
  };
}

export interface UserOverallProgress {
  totalContents: number;
  completedContents: number;
  totalActivities: number;
  completedActivities: number;
  overallProgressPercentage: number;
  recentActivities: UserActivityHistory[];
}

export const useUserProgress = (contentId: string) => {
  const { data, loading, error, refetch } = useQuery<{ userProgress: UserProgress }>(GET_USER_PROGRESS, {
    variables: { contentId },
    skip: !contentId,
  });

  return {
    progress: data?.userProgress,
    loading,
    error,
    refetch,
  };
};

export const useUserActivityHistory = (contentId?: string, limit = 10, offset = 0) => {
  const { data, loading, error, refetch, fetchMore } = useQuery<{ userActivityHistory: UserActivityHistory[] }>(
    GET_USER_ACTIVITY_HISTORY,
    {
      variables: { contentId, limit, offset },
    }
  );

  return {
    activities: data?.userActivityHistory || [],
    loading,
    error,
    refetch,
    fetchMore,
  };
};

export const useUserOverallProgress = () => {
  const { data, loading, error, refetch } = useQuery<{ userOverallProgress: UserOverallProgress }>(
    GET_USER_OVERALL_PROGRESS
  );

  return {
    overallProgress: data?.userOverallProgress,
    loading,
    error,
    refetch,
  };
};