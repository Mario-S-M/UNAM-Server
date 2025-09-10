import { gql } from '@apollo/client';

export const GET_USER_PROGRESS = gql`
  query GetUserProgress($contentId: String!) {
    userProgress(contentId: $contentId) {
      id
      userId
      contentId
      completedActivities
      totalActivities
      progressPercentage
      lastActivityDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_ACTIVITY_HISTORY = gql`
  query GetUserActivityHistory($contentId: String, $limit: Int, $offset: Int) {
    userActivityHistory(contentId: $contentId, limit: $limit, offset: $offset) {
      id
      userId
      activityId
      contentId
      score
      totalQuestions
      completedAt
      activity {
        id
        name
        description
      }
      content {
        id
        title
      }
    }
  }
`;

export const GET_USER_OVERALL_PROGRESS = gql`
  query GetUserOverallProgress {
    userOverallProgress {
      totalContents
      completedContents
      totalActivities
      completedActivities
      overallProgressPercentage
      recentActivities {
        id
        userId
        activityId
        contentId
        score
        totalQuestions
        completedAt
        activity {
          id
          name
          description
        }
        content {
          id
          title
        }
      }
    }
  }
`;