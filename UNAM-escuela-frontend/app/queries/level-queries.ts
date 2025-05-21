import { gql } from "@apollo/client";

export const GET_LEVELS = gql`
  query Levels {
    levels {
      id
      name
      description
    }
  }
`;

export const GET_LEVEL = gql`
  query Level($levelId: ID!) {
    level(id: $levelId) {
      id
      name
      description
    }
  }
`;

export const CREATE_LEVEL = gql`
  mutation CreateLevel($name: String!, $description: String!) {
    createLevel(createLevelInput: { name: $name, description: $description }) {
      id
      name
      description
    }
  }
`;

export const DELETE_LEVEL = gql`
  mutation RemoveLevel($removeLevelId: ID!) {
    removeLevel(id: $removeLevelId) {
      id
      name
      description
      isCompleted
      percentaje
      qualification
      createdAt
      updatedAt
      userId
    }
  }
`;
