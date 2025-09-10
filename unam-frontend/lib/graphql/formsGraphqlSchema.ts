import { gql } from '@apollo/client';

// Fragmentos para formularios
export const FORM_QUESTION_OPTION_FRAGMENT = gql`
  fragment FormQuestionOptionFields on FormQuestionOption {
    id
    optionText
    optionValue
    orderIndex
    imageUrl
    color
    createdAt
    updatedAt
  }
`;

export const FORM_QUESTION_FRAGMENT = gql`
  fragment FormQuestionFields on FormQuestion {
    id
    questionText
    questionType
    orderIndex
    isMandatory
    description
    placeholder
    imageUrl
    minValue
    maxValue
    maxLength
    createdAt
    updatedAt
    options {
      ...FormQuestionOptionFields
    }
  }
  ${FORM_QUESTION_OPTION_FRAGMENT}
`;

export const FORM_FRAGMENT = gql`
  fragment FormFields on Form {
    id
    title
    description
    status
    allowAnonymous
    allowMultipleResponses
    successMessage
    primaryColor
    backgroundColor
    fontFamily
    publishedAt
    closedAt
    createdAt
    updatedAt
    contentId
    userId
    content {
      id
      name
      description
    }
    user {
      id
      fullName
      email
    }
    questions {
      ...FormQuestionFields
    }
  }
  ${FORM_QUESTION_FRAGMENT}
`;

export const FORM_ANSWER_FRAGMENT = gql`
  fragment FormAnswerFields on FormAnswer {
    id
    textAnswer
    selectedOptionIds
    numericAnswer
    booleanAnswer
    createdAt
    updatedAt
    questionId
    responseId
    question {
      ...FormQuestionFields
    }
  }
  ${FORM_QUESTION_FRAGMENT}
`;

export const FORM_RESPONSE_FRAGMENT = gql`
  fragment FormResponseFields on FormResponse {
    id
    respondentName
    respondentEmail
    isAnonymous
    ipAddress
    userAgent
    status
    startedAt
    completedAt
    createdAt
    updatedAt
    formId
    userId
    form {
      id
      title
      description
    }
    user {
      id
      fullName
      email
    }
    answers {
      ...FormAnswerFields
    }
  }
  ${FORM_ANSWER_FRAGMENT}
`;

// Queries para formularios
export const GET_FORM = gql`
  query GetForm($id: ID!) {
    getForm(id: $id) {
      ...FormFields
    }
  }
  ${FORM_FRAGMENT}
`;

export const GET_FORMS_BY_CONTENT = gql`
  query GetFormsByContent($contentId: ID!, $filters: FormFiltersInput) {
    getFormsByContent(contentId: $contentId, filters: $filters) {
      ...FormFields
    }
  }
  ${FORM_FRAGMENT}
`;

export const GET_FORM_RESPONSE = gql`
  query GetFormResponse($id: ID!) {
    getFormResponse(id: $id) {
      ...FormResponseFields
    }
  }
  ${FORM_RESPONSE_FRAGMENT}
`;

export const GET_FORM_RESPONSES = gql`
  query GetFormResponses($formId: ID!) {
    getFormResponses(formId: $formId) {
      ...FormResponseFields
    }
  }
  ${FORM_RESPONSE_FRAGMENT}
`;

// Mutations para formularios
export const CREATE_FORM = gql`
  mutation CreateForm($createFormInput: CreateFormInput!) {
    createForm(createFormInput: $createFormInput) {
      ...FormFields
    }
  }
  ${FORM_FRAGMENT}
`;

export const UPDATE_FORM = gql`
  mutation UpdateForm($updateFormInput: UpdateFormInput!) {
    updateForm(updateFormInput: $updateFormInput) {
      ...FormFields
    }
  }
  ${FORM_FRAGMENT}
`;

export const DELETE_FORM = gql`
  mutation DeleteForm($id: ID!) {
    deleteForm(id: $id)
  }
`;

export const SUBMIT_FORM_RESPONSE = gql`
  mutation SubmitFormResponse($createFormResponseInput: CreateFormResponseInput!) {
    submitFormResponse(createFormResponseInput: $createFormResponseInput) {
      ...FormResponseFields
    }
  }
  ${FORM_RESPONSE_FRAGMENT}
`;

// Tipos de input para TypeScript
export interface FormFiltersInput {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateFormQuestionOptionInput {
  optionText: string;
  optionValue: string;
  orderIndex: number;
  imageUrl?: string;
  color?: string;
}

export interface CreateFormQuestionInput {
  questionText: string;
  questionType: string;
  orderIndex: number;
  isMandatory?: boolean;
  description?: string;
  placeholder?: string;
  imageUrl?: string;
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
  options?: CreateFormQuestionOptionInput[];
}

export interface CreateFormInput {
  title: string;
  description?: string;
  contentId: string;
  status?: string;
  allowAnonymous?: boolean;
  allowMultipleResponses?: boolean;
  successMessage?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  publishedAt?: string;
  closedAt?: string;
  questions: CreateFormQuestionInput[];
}

export interface UpdateFormQuestionOptionInput extends CreateFormQuestionOptionInput {
  id?: string;
}

export interface UpdateFormQuestionInput extends CreateFormQuestionInput {
  id?: string;
  options?: UpdateFormQuestionOptionInput[];
}

export interface UpdateFormInput {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  allowAnonymous?: boolean;
  allowMultipleResponses?: boolean;
  successMessage?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  publishedAt?: string;
  closedAt?: string;
  questions?: UpdateFormQuestionInput[];
}

export interface CreateFormAnswerInput {
  questionId: string;
  textAnswer?: string;
  selectedOptionIds?: string[];
  numericAnswer?: number;
  booleanAnswer?: boolean;
}

export interface CreateFormResponseInput {
  formId: string;
  respondentName?: string;
  respondentEmail?: string;
  isAnonymous?: boolean;
  answers: CreateFormAnswerInput[];
}