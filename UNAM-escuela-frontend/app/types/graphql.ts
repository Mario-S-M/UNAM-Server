// Types for GraphQL responses
export interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
  };
}

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
}
