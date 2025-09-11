'use client';

import { useEffect, useState } from 'react';

interface TestDirectGraphQLProps {
  contentId: string;
}

export default function TestDirectGraphQL({ contentId }: TestDirectGraphQLProps) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const testDirectFetch = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetContentPublic($id: ID!) {
                contentPublic(id: $id) {
                  id
                  name
                  description
                  isCompleted
                  createdAt
                  updatedAt
                  levelId
                  userId
                  markdownPath
                  validationStatus
                  publishedAt
                  skill {
                    id
                    name
                    description
                    color
                    isActive
                    createdAt
                    updatedAt
                  }
                  skillId
                  assignedTeachers {
                    id
                    fullName
                    email
                    roles
                    isActive
                  }
                }
              }
            `,
            variables: { id: contentId }
          })
        });

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error('❌ TestDirectGraphQL: Error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      testDirectFetch();
    }
  }, [contentId]);


  return (
    <div className="p-4 border border-green-200 bg-green-50 rounded">
      <h3 className="font-bold text-green-800 mb-2">🌐 Direct GraphQL Test</h3>
      
      <div>
        <h4 className="font-semibold text-green-700">Direct fetch() call:</h4>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error ? error.message : 'None'}</p>
        <p>Data: {result ? (result.data ? 'Received' : 'No data') : 'None'}</p>
        {result && result.data && (
          <p>Content Name: {result.data.contentPublic?.name || 'N/A'}</p>
        )}
      </div>
    </div>
  );
}