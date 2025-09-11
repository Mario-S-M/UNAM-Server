const query = `
  query GetActivities {
    activities {
      id
      name
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          options {
            id
            optionText
            isCorrect
          }
        }
      }
    }
  }
`;

(async () => {
  try {
    console.log('Consultando actividades...');
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    const result = await response.json();
    
    const activities = result.data.activities;
    console.log(`Encontradas ${activities.length} actividades`);
    
    activities.forEach((activity, actIndex) => {
      if (activity.form && activity.form.questions) {
        activity.form.questions.forEach((question, qIndex) => {
          if (question.questionText.toLowerCase().includes('verb') || 
              question.questionText.toLowerCase().includes('verbo')) {
            console.log(`\n=== PREGUNTA ENCONTRADA ===`);
            console.log(`Actividad: ${activity.name}`);
            console.log(`Pregunta ID: ${question.id}`);
            console.log(`Texto: ${question.questionText}`);
            console.log(`Tipo: ${question.questionType}`);
            console.log('Opciones:');
            
            if (question.options && question.options.length > 0) {
              question.options.forEach((option, optIndex) => {
                console.log(`  ${optIndex + 1}. "${option.optionText}" (isCorrect: ${option.isCorrect})`);
              });
            } else {
              console.log('  No hay opciones');
            }
          }
        });
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();