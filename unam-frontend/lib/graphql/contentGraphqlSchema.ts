import { LANGUAGE_LIST_FRAGMENT, SKILL_LIST_FRAGMENT, CONTENT_PUBLIC_FRAGMENT } from './fragments';

// Consultas para Languages
export const GET_ACTIVE_LANGUAGES = `
  ${LANGUAGE_LIST_FRAGMENT}
  
  query LenguagesActivate {
    lenguagesActivate {
      ...LanguageListFields
    }
  }
`;

// Consultas para Skills
export const GET_ACTIVE_SKILLS = `
  ${SKILL_LIST_FRAGMENT}
  
  query SkillsActivePublic {
    skillsActivePublic {
      ...SkillListFields
    }
  }
`;

// Consultas para Levels
export const GET_LEVELS_BY_LANGUAGE = `
  query LevelsByLenguage($lenguageId: ID!) {
    levelsByLenguage(lenguageId: $lenguageId) {
      id
      name
      description
      isCompleted
      percentaje
      qualification
      createdAt
      updatedAt
      userId
      isActive
      difficulty
      lenguageId
    }
  }
`;

// Consultas para Contents
export const GET_CONTENTS_BY_LEVEL = `
  query ContentsByLevelPublic($levelId: ID!) {
    contentsByLevelPublic(levelId: $levelId) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
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
    }
  }
`;

export const GET_CONTENTS_BY_SKILL = `
  ${CONTENT_PUBLIC_FRAGMENT}
  
  query ContentsBySkillPublic($skillId: ID!) {
    contentsBySkillPublic(skillId: $skillId) {
      ...ContentPublicFields
    }
  }
`;

export const GET_CONTENTS_BY_LEVEL_AND_SKILL = `
  query ContentsByLevelAndSkillPublic($levelId: ID!, $skillId: ID!) {
    contentsByLevelAndSkillPublic(levelId: $levelId, skillId: $skillId) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
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
    }
  }
`;

// Consulta para contenidos asignados al docente
export const GET_MY_ASSIGNED_CONTENTS = `
  query MyAssignedContents {
    myAssignedContents {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
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
    }
  }
`;

// Query para obtener contenido markdown
export const GET_CONTENT_MARKDOWN = `
  query ContentMarkdown($contentId: ID!) {
    contentMarkdown(contentId: $contentId)
  }
`;

// Mutation para actualizar contenido markdown
export const UPDATE_CONTENT_MARKDOWN = `
  mutation UpdateContentMarkdown($contentId: ID!, $markdownContent: String!) {
    updateContentMarkdown(contentId: $contentId, markdownContent: $markdownContent)
  }
`;