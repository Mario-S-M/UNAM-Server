const { ApolloClient, InMemoryCache, createHttpLink, gql } = require('@apollo/client');
const fetch = require('cross-fetch');
const { setContext } = require('@apollo/client/link/context');

// Configuración del cliente Apollo
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  fetch,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzZkZjY5YjU4MzE5NzJjNzNlNzNhNzciLCJlbWFpbCI6InRlYWNoZXJAdW5hbS5lZHUubXgiLCJyb2xlcyI6WyJURUFDSEVSIl0sImlhdCI6MTczNTM1NDk3NCwiZXhwIjoxNzM1NDQxMzc0fQ.valid_signature_here'
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Mutation para crear actividad
const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(createActivityInput: $input) {
      id
      name
      description
      indication
      example
      formId
      form {
        id
        title
        description
        status
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          points
          options {
            id
            optionText
            orderIndex
            isCorrect
          }
          correctAnswer
        }
      }
    }
  }
`;

// Función principal
async function createOpenTextActivity() {
  try {
    console.log('Creando actividad con preguntas abiertas...');
    
    const activityInput = {
      name: 'Actividad de Preguntas Abiertas - Prueba',
      description: 'Esta es una actividad de prueba para validar el funcionamiento de preguntas abiertas (open_text)',
      indication: 'Responde las siguientes preguntas de manera reflexiva y detallada.',
      example: 'Ejemplo: Para la pregunta sobre idiomas, puedes mencionar experiencias personales, beneficios profesionales, etc.',
      contentId: '34360628-9a46-4efb-b839-55ca53916909', // ID del contenido existente
      questions: [
        {
          questionText: '¿Cuál es tu opinión sobre la importancia del aprendizaje de idiomas en el mundo globalizado actual?',
          questionType: 'open_text',
          orderIndex: 1,
          isRequired: true,
          allowMultiline: true,
          points: 10,
          options: [],
          correctAnswer: ''
        },
        {
          questionText: 'Describe una experiencia personal que haya influido significativamente en tu perspectiva de vida.',
          questionType: 'open_text',
          orderIndex: 2,
          isRequired: true,
          allowMultiline: true,
          points: 15,
          options: [],
          correctAnswer: ''
        },
        {
          questionText: 'Explica los principales desafíos que enfrentan los estudiantes universitarios en la actualidad y propone posibles soluciones.',
          questionType: 'open_text',
          orderIndex: 3,
          isRequired: true,
          allowMultiline: true,
          points: 20,
          options: [],
          correctAnswer: ''
        },
        {
          questionText: '¿Cómo crees que la tecnología ha transformado la educación y cuáles son sus ventajas y desventajas?',
          questionType: 'open_text',
          orderIndex: 4,
          isRequired: true,
          allowMultiline: true,
          points: 15,
          options: [],
          correctAnswer: ''
        }
      ]
    };

    const result = await client.mutate({
      mutation: CREATE_ACTIVITY,
      variables: { input: activityInput }
    });

    console.log('✅ Actividad creada exitosamente:');
    console.log('ID:', result.data.createActivity.id);
    console.log('Nombre:', result.data.createActivity.name);
    console.log('Descripción:', result.data.createActivity.description);
    console.log('Indicación:', result.data.createActivity.indication);
    console.log('Ejemplo:', result.data.createActivity.example);
    
    if (result.data.createActivity.form && result.data.createActivity.form.questions) {
      console.log('Número de preguntas:', result.data.createActivity.form.questions.length);
      console.log('\n📝 Preguntas creadas:');
      result.data.createActivity.form.questions.forEach((question, index) => {
        console.log(`${index + 1}. ${question.questionText}`);
        console.log(`   Tipo: ${question.questionType}`);
        console.log(`   Puntos: ${question.points}`);
        console.log('');
      });
    } else {
      console.log('No se encontraron preguntas en el formulario asociado.');
    }

  } catch (error) {
    console.error('❌ Error al crear la actividad:', error.message);
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(err => {
        console.error('GraphQL Error:', err.message);
      });
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
}

// Ejecutar la función
createOpenTextActivity()
  .then(() => {
    console.log('\n🎉 Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });