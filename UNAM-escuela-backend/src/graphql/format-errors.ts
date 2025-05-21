import { GraphQLError, GraphQLFormattedError } from 'graphql';

export function formatError(error: GraphQLError): GraphQLFormattedError {
  const errorMessage = (error.extensions?.originalError as { message?: string })?.message || error.message;
  const errorCode = error.extensions?.code || 'ERROR';
  return {
    message: errorMessage,
    extensions: {
      code: errorCode
    }
  };
}