// GraphQL Client for UNAM School Frontend
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: {
      code?: string;
      [key: string]: any;
    };
  }>;
}

export interface GraphQLRequestOptions {
  headers?: Record<string, string>;
  includeCredentials?: boolean;
}

export class GraphQLClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T = any>(
    query: string,
    variables?: Record<string, any>,
    options?: GraphQLRequestOptions
  ): Promise<GraphQLResponse<T>> {
    const { headers = {}, includeCredentials = false } = options || {};

    const requestBody = {
      query,
      variables,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(requestBody),
        credentials: includeCredentials ? "include" : "same-origin",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors) {
        // Return the response with errors instead of throwing
        return {
          data: result.data,
          errors: result.errors,
        };
      }

      return result;
    } catch (error) {
      // Network or parsing error
      return {
        errors: [
          {
            message: error instanceof Error ? error.message : "Unknown error",
            extensions: { code: "NETWORK_ERROR" },
          },
        ],
      };
    }
  }

  async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    options?: GraphQLRequestOptions
  ): Promise<GraphQLResponse<T>> {
    return this.request<T>(query, variables, options);
  }

  async mutation<T = any>(
    mutation: string,
    variables?: Record<string, any>,
    options?: GraphQLRequestOptions
  ): Promise<GraphQLResponse<T>> {
    return this.request<T>(mutation, variables, options);
  }
}

// Create a default client instance
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

// Test function for GraphQL connection
export default async function testGraphQLConnection(): Promise<{
  success: boolean;
  serverReachable: boolean;
  endpoint: string;
  error?: string;
  responseTime?: number;
}> {
  const startTime = performance.now();

  try {
    // Simple introspection query to test connection
    const testQuery = `
      query TestConnection {
        __schema {
          queryType {
            name
          }
        }
      }
    `;

    const response = await graphqlClient.request(testQuery);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const success = !response.errors && !!response.data;

    return {
      success,
      serverReachable: true,
      endpoint: GRAPHQL_ENDPOINT,
      responseTime: Math.round(responseTime),
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // Check if it's a network error vs server error
    const isNetworkError =
      error instanceof TypeError && error.message.includes("fetch");

    return {
      success: false,
      serverReachable: !isNetworkError,
      endpoint: GRAPHQL_ENDPOINT,
      error: error instanceof Error ? error.message : String(error),
      responseTime: Math.round(responseTime),
    };
  }
}

// Common GraphQL queries and mutations
export const CONTENT_QUERIES = {
  GET_CONTENT_BY_ID: `
    query GetContentById($id: ID!) {
      content(id: $id) {
        id
        name
        description
        isCompleted
        levelId
        markdownPath
        validationStatus
        publishedAt
        skillId
        skill {
          id
          name
          description
          color
        }
        assignedTeachers {
          id
          fullName
          email
          roles
        }
        createdAt
        updatedAt
      }
    }
  `,

  GET_ALL_CONTENTS: `
    query GetAllContents {
      contents {
        id
        name
        description
        isCompleted
        levelId
        markdownPath
        validationStatus
        publishedAt
        skillId
        skill {
          id
          name
          description
          color
        }
        assignedTeachers {
          id
          fullName
          email
          roles
        }
        createdAt
        updatedAt
      }
    }
  `,
};

export const CONTENT_MUTATIONS = {
  CREATE_CONTENT: `
    mutation CreateContent($input: CreateContentInput!) {
      createContent(createContentInput: $input) {
        id
        name
        description
        isCompleted
        levelId
        markdownPath
        validationStatus
        publishedAt
        skillId
        createdAt
        updatedAt
      }
    }
  `,

  UPDATE_CONTENT: `
    mutation UpdateContent($id: ID!, $input: UpdateContentInput!) {
      updateContent(id: $id, updateContentInput: $input) {
        id
        name
        description
        isCompleted
        levelId
        markdownPath
        validationStatus
        publishedAt
        skillId
        createdAt
        updatedAt
      }
    }
  `,

  DELETE_CONTENT: `
    mutation DeleteContent($id: ID!) {
      removeContent(id: $id) {
        id
        name
      }
    }
  `,
};

// Helper functions para hacer las peticiones más fáciles con auth manual
export const contentService = {
  async getById(id: string, authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return graphqlClient.query(
      CONTENT_QUERIES.GET_CONTENT_BY_ID,
      { id },
      { headers }
    );
  },

  async getAll(authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return graphqlClient.query(
      CONTENT_QUERIES.GET_ALL_CONTENTS,
      {},
      { headers }
    );
  },

  async create(input: any, authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return graphqlClient.mutation(
      CONTENT_MUTATIONS.CREATE_CONTENT,
      { input },
      { headers }
    );
  },

  async update(id: string, input: any, authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return graphqlClient.mutation(
      CONTENT_MUTATIONS.UPDATE_CONTENT,
      { id, input },
      { headers }
    );
  },

  async delete(id: string, authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return graphqlClient.mutation(
      CONTENT_MUTATIONS.DELETE_CONTENT,
      { id },
      { headers }
    );
  },
};
