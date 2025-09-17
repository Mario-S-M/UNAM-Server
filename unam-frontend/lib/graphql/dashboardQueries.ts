import { gql } from '@apollo/client';

// Query para obtener todas las skills activas públicas
export const GET_SKILLS_ACTIVE_PUBLIC = gql`
  query GetSkillsActivePublic {
    skillsActivePublic {
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

// Query para obtener contenidos validados por skill (versión pública)
export const GET_VALIDATED_CONTENTS_BY_SKILL = gql`
  query GetValidatedContentsBySkill($skillId: ID!) {
    contentsBySkillPublic(skillId: $skillId) {
      id
      name
      description
      isCompleted
      validationStatus
      publishedAt
      createdAt
      updatedAt
      levelId
      userId
      skillId
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

// Query para obtener actividades por contenido
export const GET_ACTIVITIES_BY_CONTENT = gql`
  query GetActivitiesByContent($contentId: ID!) {
    activitiesByContent(contentId: $contentId) {
      id
      name
      description
      indication
      example
      contentId
      formId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          isRequired
          options {
            id
            optionText
            optionValue
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

// Query para obtener un contenido específico público
export const GET_CONTENT_PUBLIC = gql`
  query GetContentPublic($id: ID!) {
    contentPublic(id: $id) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      validationStatus
      publishedAt
      skillId
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
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