import { gql } from '@apollo/client';

// Language Queries
export const GET_LANGUAGES = gql`
  query GetLanguages {
    lenguages {
      id
      name
      icons
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_LANGUAGES = gql`
  query GetActiveLanguages {
    lenguagesActivate {
      id
      name
    }
  }
`;

// Level Queries
export const GET_LEVELS = gql`
  query GetLevels {
    levels {
      id
      name
      description
      difficulty
      lenguageId
    }
  }
`;

export const CREATE_LEVEL = gql`
  mutation CreateLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      id
      name
      description
      difficulty
      lenguageId
    }
  }
`;

export const UPDATE_LEVEL = gql`
  mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
    updateLevel(updateLevelInput: $updateLevelInput) {
      id
      name
      description
      difficulty
      lenguageId
    }
  }
`;

export const DELETE_LEVEL = gql`
  mutation DeleteLevel($id: ID!) {
    removeLevel(id: $id)
  }
`;

// Skill Queries
export const GET_SKILLS = gql`
  query GetSkills($search: String, $page: Int, $limit: Int, $isActive: Boolean, $levelId: ID) {
    skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive, levelId: $levelId) {
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
        level {
          id
          name
          description
          difficulty
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

export const CREATE_SKILL = gql`
  mutation CreateSkill($createSkillInput: CreateSkillInput!) {
    createSkill(createSkillInput: $createSkillInput) {
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
      level {
        id
        name
        description
        difficulty
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SKILL = gql`
  mutation UpdateSkill($updateSkillInput: UpdateSkillInput!) {
    updateSkill(updateSkillInput: $updateSkillInput) {
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
      level {
        id
        name
        description
        difficulty
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation DeleteSkill($id: ID!) {
    removeSkill(id: $id) {
      id
      name
    }
  }
`;

export const GET_SKILLS_BY_LEVEL = gql`
  query GetSkillsByLevel($levelId: ID!) {
    skillsByLevelPublic(levelId: $levelId) {
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
      level {
        id
        name
        description
        difficulty
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SKILL_BY_ID = gql`
  query GetSkillById($id: ID!) {
    skillPublic(id: $id) {
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
      level {
        id
        name
        description
        difficulty
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SKILL_BY_ID_AUTH = gql`
  query GetSkillByIdAuth($id: ID!) {
    skill(id: $id) {
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
  }
`;

// Content Queries
export const GET_CONTENTS = gql`
  query GetContents($search: String, $levelId: String, $skillId: String, $validationStatus: String, $page: Int = 1, $limit: Int = 10) {
    contentsPaginated(search: $search, levelId: $levelId, skillId: $skillId, validationStatus: $validationStatus, page: $page, limit: $limit) {
      contents {
        id
        name
        description
        validationStatus
        skill {
          id
          name
          color
        }
        assignedTeachers {
          id
          fullName
          email
        }
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

export const CREATE_CONTENT = gql`
  mutation CreateContent($createContentInput: CreateContentInput!) {
    createContent(createContentInput: $createContentInput) {
      id
      name
      description
      validationStatus
      skill {
        id
        name
        color
      }
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
    }
  }
`;

export const UPDATE_CONTENT = gql`
  mutation UpdateContent($updateContentInput: UpdateContentInput!) {
    updateContent(updateContentInput: $updateContentInput) {
      id
      name
      description
      validationStatus
      skill {
        id
        name
        color
      }
      assignedTeachers {
        id
        fullName
        email
      }
    }
  }
`;

export const DELETE_CONTENT = gql`
  mutation DeleteContent($id: ID!) {
    removeContent(id: $id)
  }
`;

// Public Content Query
export const GET_CONTENT_BY_ID_PUBLIC = gql`
  query GetContentByIdPublic($id: ID!) {
    contentPublic(id: $id) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      markdownPath
      validationStatus
      publishedAt
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
      }
      skillId
      assignedTeachers {
        id
        fullName
        email
      }
    }
  }
`;

// User Queries (for teachers in content)
export const GET_TEACHERS = gql`
  query GetTeachers {
    users {
      id
      fullName
      email
      roles
    }
  }
`;