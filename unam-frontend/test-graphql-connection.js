// Test GraphQL connection from frontend
const testGraphQLConnection = async () => {
  try {
    console.log('🔍 Testing GraphQL connection...');
    
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ExercisesByContent($contentId: ID!) {
            exercisesByContent(contentId: $contentId) {
              id
              name
              description
              indication
              example
              contentId
              form {
                id
                title
                questions {
                  id
                  questionText
                  questionType
                  orderIndex
                  isRequired
                  correctAnswer
                  explanation
                  incorrectFeedback
                  points
                  options {
                    id
                    optionText
                    optionValue
                    orderIndex
                    isCorrect
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          contentId: "34360628-9a46-4efb-b839-55ca53916909"
        }
      })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      const text = await response.text();
      console.error('❌ Response body:', text);
      return;
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
    } else {
      console.log('✅ GraphQL query successful!');
      console.log('📊 Exercises found:', result.data?.exercisesByContent?.length || 0);
      console.log('📊 Full result:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('💥 Network error:', error.message);
    console.error('💥 Error details:', error);
  }
};

// Run the test
testGraphQLConnection();

// Also test if we can reach the GraphQL endpoint at all
fetch('http://localhost:3000/graphql', {
  method: 'GET'
})
.then(response => {
  console.log('🌐 GET request to GraphQL endpoint status:', response.status);
  return response.text();
})
.then(text => {
  console.log('🌐 GET response:', text.substring(0, 200) + '...');
})
.catch(error => {
  console.error('🌐 GET request failed:', error.message);
});