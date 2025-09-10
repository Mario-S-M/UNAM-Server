// Script para probar la edición de preguntas existentes
const activityId = 'db9ea871-9280-48df-b8e7-209fd8f21528';

// Primero obtener las preguntas actuales
const getActivityQuery = `
  query GetActivity($id: ID!) {
    activity(id: $id) {
      id
      name
      form {
        id
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          description
          placeholder
          maxLength
          allowMultiline
          correctAnswer
          explanation
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
    }
  }
`;

const updateActivityMutation = `
  mutation UpdateActivity($updateActivityInput: UpdateActivityInput!) {
    updateActivity(updateActivityInput: $updateActivityInput) {
      id
      name
      form {
        id
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          options {
            id
            optionText
            orderIndex
            isCorrect
          }
        }
      }
    }
  }
`;

const graphqlEndpoint = 'http://localhost:3000/graphql';

console.log('=== TESTING QUESTION EDITING ===');
console.log('Step 1: Getting current questions...');

// Primero obtener las preguntas actuales
fetch(graphqlEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: getActivityQuery,
    variables: { id: activityId }
  })
})
.then(response => response.json())
.then(data => {
  console.log('Current activity data:', JSON.stringify(data, null, 2));
  
  if (data.data && data.data.activity && data.data.activity.form && data.data.activity.form.questions) {
    const currentQuestions = data.data.activity.form.questions;
    console.log(`\nFound ${currentQuestions.length} existing questions`);
    
    // Modificar las preguntas existentes
    const editedQuestions = currentQuestions.map((question, index) => {
      const baseQuestion = {
        questionText: `[EDITADA] ${question.questionText}`,
        questionType: question.questionType,
        orderIndex: index,
        isRequired: !question.isRequired, // Cambiar el estado de requerido
        description: question.description || `Descripción editada para pregunta ${index + 1}`,
        placeholder: question.placeholder || 'Placeholder editado',
        imageUrl: question.imageUrl || '',
        minValue: question.minValue || 0,
        maxValue: question.maxValue || 0,
        minLabel: question.minLabel || '',
        maxLabel: question.maxLabel || '',
        maxLength: question.maxLength || 100,
        allowMultiline: question.allowMultiline || false,
        correctAnswer: question.correctAnswer || 'Respuesta editada',
        explanation: question.explanation || `Explicación editada para pregunta ${index + 1}`,
        incorrectFeedback: question.incorrectFeedback || 'Feedback editado',
        points: (question.points || 5) + 2, // Aumentar puntos
        options: question.options ? question.options.map((option, optIndex) => ({
          optionText: `[EDITADA] ${option.optionText}`,
          optionValue: option.optionValue || `edited_value_${optIndex}`,
          orderIndex: optIndex,
          imageUrl: option.imageUrl || '',
          color: option.color || '',
          isCorrect: optIndex === 0 // Hacer que la primera opción sea siempre correcta
        })) : []
      };
      
      return baseQuestion;
    });
    
    console.log('\nStep 2: Updating questions with edits...');
    console.log('Edited questions:', JSON.stringify(editedQuestions, null, 2));
    
    // Enviar las preguntas editadas
    return fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: updateActivityMutation,
        variables: {
          updateActivityInput: {
            id: activityId,
            questions: editedQuestions
          }
        }
      })
    });
  } else {
    throw new Error('No questions found in activity');
  }
})
.then(response => response.json())
.then(data => {
  console.log('\n=== EDIT RESULT ===');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.data && data.data.updateActivity) {
    console.log('\n=== SUCCESS ===');
    console.log('Questions edited successfully!');
    console.log('Updated questions:', data.data.updateActivity.form?.questions?.length || 0);
    console.log('\n=== FRONTEND URL ===');
    console.log(`http://localhost:3001/teacher/activities/questions/${activityId}`);
  } else if (data.errors) {
    console.log('\n=== ERRORS ===');
    data.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.message}`);
    });
  }
})
.catch(error => {
  console.error('\n=== ERROR ===');
  console.error(error);
});