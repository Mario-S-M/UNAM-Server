// Script para probar la creación de diferentes tipos de preguntas
const activityId = 'db9ea871-9280-48df-b8e7-209fd8f21528'; // ID de la primera actividad

const updateActivityMutation = `
  mutation UpdateActivity($updateActivityInput: UpdateActivityInput!) {
    updateActivity(updateActivityInput: $updateActivityInput) {
      id
      name
      description
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
            optionValue
            orderIndex
            isCorrect
          }
        }
      }
    }
  }
`;

// Crear diferentes tipos de preguntas de prueba
const testQuestions = [
  {
    questionText: '¿Cuál es la capital de México?',
    questionType: 'MULTIPLE_CHOICE',
    orderIndex: 0,
    isRequired: true,
    description: 'Pregunta de geografía básica',
    placeholder: '',
    imageUrl: '',
    minValue: 0,
    maxValue: 0,
    minLabel: '',
    maxLabel: '',
    maxLength: 0,
    allowMultiline: false,
    correctAnswer: 'Ciudad de México',
    explanation: 'Ciudad de México es la capital y ciudad más poblada de México',
    incorrectFeedback: 'Incorrecto, la capital de México es Ciudad de México',
    points: 10,
    options: [
      {
        optionText: 'Ciudad de México',
        optionValue: 'cdmx',
        orderIndex: 0,
        imageUrl: '',
        color: '',
        isCorrect: true
      },
      {
        optionText: 'Guadalajara',
        optionValue: 'gdl',
        orderIndex: 1,
        imageUrl: '',
        color: '',
        isCorrect: false
      },
      {
        optionText: 'Monterrey',
        optionValue: 'mty',
        orderIndex: 2,
        imageUrl: '',
        color: '',
        isCorrect: false
      }
    ]
  },
  {
    questionText: 'Describe tu experiencia con las matemáticas',
    questionType: 'OPEN_TEXT',
    orderIndex: 1,
    isRequired: false,
    description: 'Pregunta abierta sobre experiencia personal',
    placeholder: 'Escribe tu respuesta aquí...',
    imageUrl: '',
    minValue: 0,
    maxValue: 0,
    minLabel: '',
    maxLabel: '',
    maxLength: 500,
    allowMultiline: true,
    correctAnswer: '',
    explanation: 'No hay respuesta correcta específica para esta pregunta',
    incorrectFeedback: '',
    points: 5,
    options: []
  },
  {
    questionText: '¿Qué temas te interesan más? (Selecciona todos los que apliquen)',
    questionType: 'CHECKBOX',
    orderIndex: 2,
    isRequired: true,
    description: 'Pregunta de selección múltiple',
    placeholder: '',
    imageUrl: '',
    minValue: 0,
    maxValue: 0,
    minLabel: '',
    maxLabel: '',
    maxLength: 0,
    allowMultiline: false,
    correctAnswer: '',
    explanation: 'Puedes seleccionar múltiples opciones',
    incorrectFeedback: '',
    points: 8,
    options: [
      {
        optionText: 'Matemáticas',
        optionValue: 'math',
        orderIndex: 0,
        imageUrl: '',
        color: '',
        isCorrect: true
      },
      {
        optionText: 'Ciencias',
        optionValue: 'science',
        orderIndex: 1,
        imageUrl: '',
        color: '',
        isCorrect: true
      },
      {
        optionText: 'Historia',
        optionValue: 'history',
        orderIndex: 2,
        imageUrl: '',
        color: '',
        isCorrect: true
      },
      {
        optionText: 'Arte',
        optionValue: 'art',
        orderIndex: 3,
        imageUrl: '',
        color: '',
        isCorrect: true
      }
    ]
  }
];

const graphqlEndpoint = 'http://localhost:3000/graphql';

console.log('=== TESTING QUESTION CREATION ===');
console.log('Activity ID:', activityId);
console.log('Questions to create:', testQuestions.length);

fetch(graphqlEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: updateActivityMutation,
    variables: {
      updateActivityInput: {
        id: activityId,
        questions: testQuestions
      }
    }
  })
})
.then(response => response.json())
.then(data => {
  console.log('=== MUTATION RESULT ===');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.data && data.data.updateActivity) {
    console.log('\n=== SUCCESS ===');
    console.log('Activity updated successfully!');
    console.log('Questions created:', data.data.updateActivity.form?.questions?.length || 0);
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
  console.error('\n=== NETWORK ERROR ===');
  console.error(error);
});