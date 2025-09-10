const fetch = require('node-fetch').default;

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

const CREATE_ACTIVITY_MUTATION = `
  mutation CreateActivity($createActivityInput: CreateActivityInput!) {
    createActivity(createActivityInput: $createActivityInput) {
      id
      name
      description
      contentId
      formId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          orderIndex
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

const activityInput = {
  name: "Examen de Matemáticas Básicas",
  description: "Actividad de examen para practicar matemáticas básicas",
  indication: "Responde todas las preguntas seleccionando la opción correcta",
  example: "Ejemplo: ¿Cuál es 1+1? a) 1 b) 2 c) 3. Respuesta correcta: b) 2",
  contentId: "34360628-9a46-4efb-b839-55ca53916909", // ID real obtenido de la base de datos
  questions: [
    {
      questionText: "¿Cuál es el resultado de 2 + 2?",
      questionType: "multiple_choice",
      orderIndex: 1,
      isRequired: true,
      allowMultiline: false,
      options: [
        {
          optionText: "3",
          orderIndex: 1,
          isCorrect: false
        },
        {
          optionText: "4",
          orderIndex: 2,
          isCorrect: true
        },
        {
          optionText: "5",
          orderIndex: 3,
          isCorrect: false
        },
        {
          optionText: "6",
          orderIndex: 4,
          isCorrect: false
        }
      ]
    },
    {
      questionText: "¿Cuál es el resultado de 5 × 3?",
      questionType: "multiple_choice",
      orderIndex: 2,
      isRequired: true,
      allowMultiline: false,
      options: [
        {
          optionText: "12",
          orderIndex: 1,
          isCorrect: false
        },
        {
          optionText: "15",
          orderIndex: 2,
          isCorrect: true
        },
        {
          optionText: "18",
          orderIndex: 3,
          isCorrect: false
        },
        {
          optionText: "20",
          orderIndex: 4,
          isCorrect: false
        }
      ]
    },
    {
      questionText: "¿Cuál es el resultado de 10 ÷ 2?",
      questionType: "multiple_choice",
      orderIndex: 3,
      isRequired: true,
      allowMultiline: false,
      options: [
        {
          optionText: "4",
          orderIndex: 1,
          isCorrect: false
        },
        {
          optionText: "5",
          orderIndex: 2,
          isCorrect: true
        },
        {
          optionText: "6",
          orderIndex: 3,
          isCorrect: false
        },
        {
          optionText: "7",
          orderIndex: 4,
          isCorrect: false
        }
      ]
    }
  ]
};

async function createTestActivity() {
  try {
    console.log('Creating test activity via GraphQL...');
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CREATE_ACTIVITY_MUTATION,
        variables: {
          createActivityInput: activityInput
        }
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return;
    }
    
    console.log('Activity created successfully!');
    console.log('Activity ID:', result.data.createActivity.id);
    console.log('Form ID:', result.data.createActivity.formId);
    console.log('Questions created:', result.data.createActivity.form.questions.length);
    
  } catch (error) {
    console.error('Error creating test activity:', error);
  }
}

createTestActivity();