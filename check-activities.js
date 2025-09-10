const fetch = require('node-fetch').default;

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

const GET_ALL_ACTIVITIES = `
  query GetAllActivities {
    activities {
      id
      name
      description
      contentId
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
            isCorrect
            orderIndex
          }
        }
      }
    }
  }
`;

async function checkActivities() {
  try {
    console.log('🔍 Consultando todas las actividades...');
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: GET_ALL_ACTIVITIES
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }
    
    const activities = result.data.activities;
    console.log(`✅ Encontradas ${activities.length} actividades`);
    
    activities.forEach((activity, actIndex) => {
      console.log(`\n=== ACTIVIDAD ${actIndex + 1} ===`);
      console.log(`ID: ${activity.id}`);
      console.log(`Nombre: ${activity.name}`);
      console.log(`ContentId: ${activity.contentId}`);
      
      if (activity.form && activity.form.questions) {
        console.log(`Preguntas: ${activity.form.questions.length}`);
        
        activity.form.questions.forEach((question, qIndex) => {
          console.log(`\n  PREGUNTA ${qIndex + 1}:`);
          console.log(`  ID: ${question.id}`);
          console.log(`  Texto: ${question.questionText}`);
          console.log(`  Tipo: ${question.questionType}`);
          console.log(`  Orden: ${question.orderIndex}`);
          
          if (question.options && question.options.length > 0) {
            console.log(`  Opciones: ${question.options.length}`);
            question.options.forEach((option, oIndex) => {
              const correctMark = option.isCorrect ? '✅' : '❌';
              console.log(`    ${oIndex + 1}. ${option.optionText} ${correctMark}`);
            });
          } else {
            console.log(`  ⚠️  SIN OPCIONES - Esta pregunta no se puede responder`);
          }
        });
      } else {
        console.log('Sin formulario o preguntas');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkActivities();