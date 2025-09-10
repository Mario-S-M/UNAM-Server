import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getCookie } from '@/lib/cookies';
import { Operation, NextLink, FetchResult } from '@apollo/client/core';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

// Simplified logging link for production
const loggingLink = new ApolloLink((operation, forward) => {
  if (!forward) {
    throw new Error('No forward function provided to loggingLink');
  }
  
  return forward(operation);
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from cookies if it exists
  const token = typeof window !== 'undefined' ? getCookie('auth_token') : null;
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// List of public operations that don't require authentication
const PUBLIC_OPERATIONS = [
  'skillsActivePublic',
  'contentsBySkillPublic', 
  'contentPublic',
  'skillsByLevelPublic',
  'skillPublic',
  'lenguage',
  'level',
  'activitiesByContent',
  'exercisesByContent',
  'ExercisesByContent',
  'submitFormResponse',
  'SubmitFormResponse',
  'GetSkillsActivePublic',
  'GetValidatedContentsBySkill',
  'GetContentPublic',
  'GetSkillsByLevel',
  'GetSkillById',
  'GetLanguageById',
  'GetLevelById',
  'GetActivitiesByContent',
  'GetExercisesByContent',
  'Revalidate',
  'revalidate'
];

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // Check if it's an authentication error and if the operation is public
      const isAuthError = message.includes('Usuario no autenticado') || message.includes('no autenticado');
      const isPublicOperation = operation.operationName && (
        operation.operationName.includes('Public') || 
        operation.operationName.toLowerCase().includes('public') ||
        PUBLIC_OPERATIONS.includes(operation.operationName)
      );
      
      // Suppress authentication errors completely for public operations
      // These are expected and should not be shown to users or developers
      if (isAuthError && isPublicOperation) {
        // Completely silent for public operations
        return;
      } else if (isAuthError && !isPublicOperation) {
        // Suppress authentication errors for protected operations too
        // as they are handled by the UI components
        return;
      } else {
        // Log all other non-authentication errors normally
        console.error(
          `GraphQL error: ${message}`, 
          locations && `Location: ${JSON.stringify(locations)}`,
          path && `Path: ${path}`
        );
      }
    });
  }

  if (networkError) {
    console.error('Network error:', networkError);
  }
});

const client = new ApolloClient({
  link: from([errorLink, loggingLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Apollo Client initialized with clean error handling

export default client;