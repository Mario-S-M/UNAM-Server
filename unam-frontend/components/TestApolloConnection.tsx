'use client';

import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';

const TEST_QUERY = gql`
  query TestConnection {
    __typename
  }
`;

export function TestApolloConnection() {
  
  const { loading, error, data } = useQuery(TEST_QUERY, {
    onCompleted: (data) => {
    },
    onError: (error) => {
      console.error('🧪 TestApolloConnection: Query failed:', error);
    }
  });
  
  useEffect(() => {
  }, [loading, error, data]);
  
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Apollo Connection Test</h3>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Error: {error?.message || 'None'}</p>
      <p>Data: {data ? JSON.stringify(data) : 'None'}</p>
    </div>
  );
}