'use client';

import { useQuery, useApolloClient, gql } from '@apollo/client';
import { GET_CONTENT_PUBLIC } from '@/lib/graphql/dashboardQueries';
import { useEffect, useState } from 'react';

interface TestApolloQueryProps {
  contentId: string;
}

// Simple test query
const TEST_QUERY = gql`
  query TestQuery {
    __typename
  }
`;

export default function TestApolloQuery({ contentId }: TestApolloQueryProps) {
  const client = useApolloClient();
  const [manualResult, setManualResult] = useState<any>(null);
  const [manualError, setManualError] = useState<any>(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  
  console.log('🚀 TestApolloQuery: Component rendering with contentId:', contentId);
  console.log('🔧 TestApolloQuery: Apollo client:', client);
  console.log('📋 TestApolloQuery: GET_CONTENT_PUBLIC query:', GET_CONTENT_PUBLIC);
  
  // Simple test query
  useEffect(() => {
    const executeTestQuery = async () => {
      console.log('🧪 TestApolloQuery: Starting simple test query...');
      setTestLoading(true);
      try {
        const result = await client.query({
          query: TEST_QUERY,
          fetchPolicy: 'no-cache',
        });
        console.log('✅ TestApolloQuery: Test query success:', result);
        setTestResult(result);
      } catch (err) {
        console.error('❌ TestApolloQuery: Test query error:', err);
        setTestError(err);
      } finally {
        setTestLoading(false);
      }
    };

    executeTestQuery();
  }, [client]);
  
  // Manual query with client.query
  useEffect(() => {
    const executeManualQuery = async () => {
      console.log("🔍 TestApolloQuery: Starting manual query with variables:", { id: contentId });
      console.log("🔍 TestApolloQuery: Client instance:", client);
      console.log("🔍 TestApolloQuery: Client link:", client.link);
      
      setManualLoading(true);
      try {
        console.log("🔍 TestApolloQuery: About to call client.query...");
        const result = await client.query({
          query: GET_CONTENT_PUBLIC,
          variables: { id: contentId },
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        });
        console.log("✅ TestApolloQuery: Manual query success:", result);
        setManualResult(result);
      } catch (err) {
          console.error("❌ TestApolloQuery: Manual query error:", err);
          const apolloError = err as any;
          console.error("❌ TestApolloQuery: Error details:", {
            message: apolloError.message,
            stack: apolloError.stack,
            networkError: apolloError.networkError,
            graphQLErrors: apolloError.graphQLErrors
          });
          setManualError(apolloError);
      } finally {
        setManualLoading(false);
        console.log("🔍 TestApolloQuery: Manual query finished");
      }
    };

    if (contentId) {
      console.log("🔍 TestApolloQuery: ContentId provided, executing manual query...");
      executeManualQuery();
    } else {
      console.log("🔍 TestApolloQuery: No contentId provided");
    }
  }, [client, contentId]);
  
  const { data, loading, error, refetch } = useQuery(GET_CONTENT_PUBLIC, {
    variables: { id: contentId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('✅ TestApolloQuery: useQuery completed:', data);
    },
    onError: (error) => {
      console.error('❌ TestApolloQuery: useQuery error:', error);
    }
  });
  
  console.log('🧪 TestApolloQuery: useQuery state:', { data, loading, error });
  console.log('🔧 TestApolloQuery: Manual query state:', { manualResult, manualLoading, manualError });
  console.log('🧪 TestApolloQuery: Test query state:', { testResult, testLoading, testError });
  
  return (
    <div className="p-4 border border-blue-200 bg-blue-50 rounded">
      <h3 className="font-bold text-blue-800 mb-2">🧪 Apollo Client Test</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold text-blue-700">Simple Test Query (__typename):</h4>
        <p>Loading: {testLoading ? 'Yes' : 'No'}</p>
        <p>Error: {testError ? testError.message : 'None'}</p>
        <p>Data: {testResult ? JSON.stringify(testResult.data) : 'None'}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-blue-700">useQuery Hook:</h4>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error ? error.message : 'None'}</p>
        <p>Data: {data ? 'Received' : 'None'}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Refetch
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-blue-700">Manual client.query():</h4>
        <p>Loading: {manualLoading ? 'Yes' : 'No'}</p>
        <p>Error: {manualError ? manualError.message : 'None'}</p>
        <p>Data: {manualResult ? 'Received' : 'None'}</p>
      </div>
    </div>
  );
}