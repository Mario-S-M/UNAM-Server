const { ApolloClient, InMemoryCache, gql, createHttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

// Configurar Apollo Client
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  fetch: fetch,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Query para obtener actividades
const GET_ACTIVITIES = gql`
  query GetActivities {
    activities {
      id
      name
      form {
        id
        questions {
          id
          questionText
          questionType
        }
      }
    }
  }
`;

// Mutation para actualizar actividad
const UPDATE_ACTIVITY = gql`
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
        }
      }
    }
  }
`;

async function testAutoSave() {
  try {
    console.log('🔍 Obteniendo actividades...');
    
    // Obtener actividades
    const { data } = await client.query({
      query: GET_ACTIVITIES,
      fetchPolicy: 'network-only'
    });
    
    if (!data.activities || data.activities.length === 0) {
      console.log('❌ No se encontraron actividades');
      return;
    }
    
    // Usar la primera actividad que tenga preguntas
    const activityWithQuestions = data.activities.find(activity => 
      activity.form && activity.form.questions && activity.form.questions.length > 0
    );
    
    if (!activityWithQuestions) {
      console.log('❌ No se encontraron actividades con preguntas');
      return;
    }
    
    const activityId = activityWithQuestions.id;
    console.log(`✅ Usando actividad: ${activityWithQuestions.name} (ID: ${activityId})`);
    console.log(`📝 Preguntas actuales: ${activityWithQuestions.form.questions.length}`);
    
    // Simular múltiples guardados automáticos (como si el usuario estuviera editando)
    const saveIntervals = [1000, 2000, 3000]; // Simular guardados cada 1, 2 y 3 segundos
    
    for (let i = 0; i < saveIntervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, saveIntervals[i]));
      
      console.log(`\n🔄 Simulando guardado automático #${i + 1}...`);
      
      // Modificar ligeramente las preguntas para simular cambios del usuario
      const updatedQuestions = activityWithQuestions.form.questions.map((question, index) => ({
        questionText: `${question.questionText} (Auto-save ${i + 1})`,
        questionType: question.questionType,
        orderIndex: index,
        isRequired: true,
        description: '',
        placeholder: '',
        imageUrl: '',
        minValue: 0,
        maxValue: 0,
        minLabel: '',
        maxLabel: '',
        maxLength: 0,
        allowMultiline: false,
        correctAnswer: '',
        explanation: '',
        incorrectFeedback: '',
        points: 0,
        options: []
      }));
      
      const result = await client.mutate({
        mutation: UPDATE_ACTIVITY,
        variables: {
          updateActivityInput: {
            id: activityId,
            questions: updatedQuestions
          }
        }
      });
      
      console.log(`✅ Guardado automático #${i + 1} completado`);
      console.log(`📊 Preguntas guardadas: ${result.data.updateActivity.form.questions.length}`);
    }
    
    console.log('\n🎉 Prueba de guardado automático completada exitosamente!');
    console.log(`🌐 Puedes verificar los cambios en: http://localhost:3001/teacher/activities/questions/${activityId}`);
    
  } catch (error) {
    console.error('❌ Error en la prueba de guardado automático:', error);
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(err => console.error('GraphQL Error:', err.message));
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
}

// Ejecutar la prueba
testAutoSave();