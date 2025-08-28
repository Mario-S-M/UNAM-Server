import { gql } from '@apollo/client';
import {
  LANGUAGE_LIST_FRAGMENT,
  LANGUAGE_FORM_FRAGMENT,
  LANGUAGE_SELECT_FRAGMENT,
  LEVEL_LIST_FRAGMENT,
  LEVEL_SELECT_FRAGMENT,
  SKILL_LIST_FRAGMENT,
  SKILL_FORM_FRAGMENT,
  SKILL_SELECT_FRAGMENT,
  USER_LIST_FRAGMENT,
  USER_SELECT_FRAGMENT,
  CONTENT_LIST_FRAGMENT,
  CONTENT_PUBLIC_FRAGMENT,
  SKILL_PUBLIC_FRAGMENT,
  MUTATION_RESPONSE_FRAGMENT,
  DELETE_RESPONSE_FRAGMENT,
  LEVEL_MUTATION_RESPONSE_FRAGMENT,
  LEVEL_DELETE_RESPONSE_FRAGMENT,
  SKILL_MUTATION_RESPONSE_FRAGMENT,
  SKILL_DELETE_RESPONSE_FRAGMENT,
  USER_MUTATION_RESPONSE_FRAGMENT,
  USER_DELETE_RESPONSE_FRAGMENT,
  CONTENT_MUTATION_RESPONSE_FRAGMENT,
  CONTENT_DELETE_RESPONSE_FRAGMENT
} from './fragments';

// ===== LANGUAGE QUERIES =====

export const GET_LANGUAGES_OPTIMIZED = gql`
  ${LANGUAGE_LIST_FRAGMENT}
  query GetLanguages {
    lenguages {
      ...LanguageListFields
    }
  }
`;

export const GET_ACTIVE_LANGUAGES_OPTIMIZED = gql`
  ${LANGUAGE_SELECT_FRAGMENT}
  query GetActiveLanguages {
    lenguagesActivate {
      ...LanguageSelectFields
    }
  }
`;

// ===== LEVEL QUERIES =====

export const GET_LEVELS_OPTIMIZED = gql`
  ${LEVEL_LIST_FRAGMENT}
  query GetLevels {
    levels {
      ...LevelListFields
    }
  }
`;

export const GET_LEVELS_BY_LANGUAGE_OPTIMIZED = gql`
  ${LEVEL_SELECT_FRAGMENT}
  query GetLevelsByLanguage($languageId: ID!) {
    levelsByLanguage(languageId: $languageId) {
      ...LevelSelectFields
    }
  }
`;

// ===== SKILL QUERIES =====

export const GET_SKILLS_OPTIMIZED = gql`
  ${SKILL_LIST_FRAGMENT}
  query GetSkills($search: String, $page: Int, $limit: Int, $isActive: Boolean, $levelId: ID) {
    skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive, levelId: $levelId) {
      skills {
        ...SkillListFields
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

export const GET_SKILLS_BY_LEVEL_OPTIMIZED = gql`
  ${SKILL_PUBLIC_FRAGMENT}
  query GetSkillsByLevel($levelId: ID!) {
    skillsByLevelPublic(levelId: $levelId) {
      ...SkillPublicFields
    }
  }
`;

export const GET_SKILL_BY_ID_OPTIMIZED = gql`
  ${SKILL_FORM_FRAGMENT}
  query GetSkillById($id: ID!) {
    skill(id: $id) {
      ...SkillFormFields
    }
  }
`;

// ===== USER QUERIES =====

export const GET_USERS_PAGINATED_OPTIMIZED = gql`
  ${USER_LIST_FRAGMENT}
  query GetUsersPaginated($search: String, $page: Int, $limit: Int, $role: String, $isActive: Boolean) {
    usersPaginated(search: $search, page: $page, limit: $limit, role: $role, isActive: $isActive) {
      users {
        ...UserListFields
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

// ===== CONTENT QUERIES =====

export const GET_CONTENTS_OPTIMIZED = gql`
  ${CONTENT_LIST_FRAGMENT}
  query GetContents($search: String, $levelId: String, $skillId: String, $validationStatus: String, $page: Int = 1, $limit: Int = 10) {
    contentsPaginated(search: $search, levelId: $levelId, skillId: $skillId, validationStatus: $validationStatus, page: $page, limit: $limit) {
      contents {
        ...ContentListFields
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

export const GET_CONTENTS_BY_SKILL_OPTIMIZED = gql`
  ${CONTENT_PUBLIC_FRAGMENT}
  query GetContentsBySkill($skillId: ID!) {
    contentsBySkill(skillId: $skillId) {
      ...ContentPublicFields
    }
  }
`;

// ===== LANGUAGE MUTATIONS =====

export const CREATE_LANGUAGE_OPTIMIZED = gql`
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation CreateLanguage($createLenguageInput: CreateLenguageInput!) {
    createLenguage(createLenguageInput: $createLenguageInput) {
      ...MutationResponseFields
    }
  }
`;

export const UPDATE_LANGUAGE_OPTIMIZED = gql`
  ${MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateLanguage($updateLenguageInput: UpdateLenguageInput!) {
    updateLenguage(updateLenguageInput: $updateLenguageInput) {
      ...MutationResponseFields
    }
  }
`;

export const DELETE_LANGUAGE_OPTIMIZED = gql`
  ${DELETE_RESPONSE_FRAGMENT}
  mutation DeleteLanguage($id: ID!) {
    removeLenguage(id: $id) {
      ...DeleteResponseFields
    }
  }
`;

// ===== LEVEL MUTATIONS =====

export const CREATE_LEVEL_OPTIMIZED = gql`
  ${LEVEL_MUTATION_RESPONSE_FRAGMENT}
  mutation CreateLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      ...LevelMutationResponseFields
    }
  }
`;

export const UPDATE_LEVEL_OPTIMIZED = gql`
  ${LEVEL_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
    updateLevel(updateLevelInput: $updateLevelInput) {
      ...LevelMutationResponseFields
    }
  }
`;

export const DELETE_LEVEL_OPTIMIZED = gql`
  ${LEVEL_DELETE_RESPONSE_FRAGMENT}
  mutation DeleteLevel($id: ID!) {
    removeLevel(id: $id) {
      ...LevelDeleteResponseFields
    }
  }
`;

// ===== SKILL MUTATIONS =====

export const CREATE_SKILL_OPTIMIZED = gql`
  ${SKILL_MUTATION_RESPONSE_FRAGMENT}
  mutation CreateSkill($createSkillInput: CreateSkillInput!) {
    createSkill(createSkillInput: $createSkillInput) {
      ...SkillMutationResponseFields
    }
  }
`;

export const UPDATE_SKILL_OPTIMIZED = gql`
  ${SKILL_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateSkill($updateSkillInput: UpdateSkillInput!) {
    updateSkill(updateSkillInput: $updateSkillInput) {
      ...SkillMutationResponseFields
    }
  }
`;

export const DELETE_SKILL_OPTIMIZED = gql`
  ${SKILL_DELETE_RESPONSE_FRAGMENT}
  mutation DeleteSkill($id: ID!) {
    removeSkill(id: $id) {
      ...SkillDeleteResponseFields
    }
  }
`;

// ===== USER MUTATIONS =====

export const UPDATE_USER_OPTIMIZED = gql`
  ${USER_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      ...UserMutationResponseFields
    }
  }
`;

export const UPDATE_USER_ROLES_OPTIMIZED = gql`
  ${USER_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateUserRoles($id: String!, $roles: [String!]!) {
    updateUserRoles(id: $id, roles: $roles) {
      ...UserMutationResponseFields
    }
  }
`;

export const DELETE_USER_OPTIMIZED = gql`
  ${USER_DELETE_RESPONSE_FRAGMENT}
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      ...UserDeleteResponseFields
    }
  }
`;

// ===== CONTENT MUTATIONS =====

export const CREATE_CONTENT_OPTIMIZED = gql`
  ${CONTENT_MUTATION_RESPONSE_FRAGMENT}
  mutation CreateContent($createContentInput: CreateContentInput!) {
    createContent(createContentInput: $createContentInput) {
      ...ContentMutationResponseFields
    }
  }
`;

export const UPDATE_CONTENT_OPTIMIZED = gql`
  ${CONTENT_MUTATION_RESPONSE_FRAGMENT}
  mutation UpdateContent($updateContentInput: UpdateContentInput!) {
    updateContent(updateContentInput: $updateContentInput) {
      ...ContentMutationResponseFields
    }
  }
`;

export const DELETE_CONTENT_OPTIMIZED = gql`
  ${CONTENT_DELETE_RESPONSE_FRAGMENT}
  mutation DeleteContent($id: ID!) {
    removeContent(id: $id) {
      ...ContentDeleteResponseFields
    }
  }
`;