'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import { Toaster } from 'sonner';

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export default function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return (
    <ApolloProvider client={client}>
      {children}
      <Toaster position="top-right" richColors />
    </ApolloProvider>
  );
}