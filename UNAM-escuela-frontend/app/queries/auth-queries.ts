import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        id
        fullName
        email
        roles
        isActive
      }
    }
  }
`;