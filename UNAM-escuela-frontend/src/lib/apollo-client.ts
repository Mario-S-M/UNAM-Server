import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Determinamos la URL base según el contexto
const getBackendUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://backend:3000/graphql';  // Para SSR dentro de Docker
  }
  
  // Para el navegador, usar la URL base actual
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:3000/graphql`;
};

const BACKEND_URL = getBackendUrl();
console.log('Using GraphQL endpoint:', BACKEND_URL);

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    console.log('GraphQL Errors:', graphQLErrors);
  }
  if (networkError) {
    console.log('Network Error:', networkError);
    console.log('Error details:', networkError.cause);
  }
});

const httpLink = new HttpLink({
    uri: BACKEND_URL,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }
});

export default client;