'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import { Toaster } from 'sonner';

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export default function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  console.log('🔧 ApolloProviderWrapper: Initializing with client:', client);
  console.log('🔧 ApolloProviderWrapper: Client link:', client.link);
  
  return (
    <ApolloProvider client={client}>
      {children}
      <Toaster />
    </ApolloProvider>
  );
}