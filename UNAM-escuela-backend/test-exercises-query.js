const fetch = require('node-fetch').default;

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

const TEST_EXERCISES_QUERY = `
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
`;

async function testExercisesQuery() {
  try {
    console.log('Testing exercisesByContent query...');
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: TEST_EXERCISES_QUERY,
        variables: {
          contentId: "34360628-9a46-4efb-b839-55ca53916909"
        }
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    } else {
      console.log('Query successful!');
      console.log('Exercises found:', result.data?.exercisesByContent?.length || 0);
      console.log('Full result:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error testing query:', error.message);
  }
}

testExercisesQuery();