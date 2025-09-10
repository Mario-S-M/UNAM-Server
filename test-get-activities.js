// Script para obtener actividades existentes
const query = `
  query GetActivities {
    activities {
      id
      name
      description
      contentId
      createdAt
    }
  }
`;

const graphqlEndpoint = 'http://localhost:3000/graphql';

fetch(graphqlEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: query
  })
})
.then(response => response.json())
.then(data => {
  console.log('=== ACTIVITIES QUERY RESULT ===');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.data && data.data.activities && data.data.activities.length > 0) {
    console.log('\n=== FOUND ACTIVITIES ===');
    data.data.activities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.name} (ID: ${activity.id})`);
    });
    
    // Usar la primera actividad para navegar
    const firstActivity = data.data.activities[0];
    console.log(`\n=== NAVIGATION URL ===`);
    console.log(`http://localhost:3001/teacher/activities/questions/${firstActivity.id}`);
  } else {
    console.log('No activities found. You need to create one first.');
  }
})
.catch(error => {
  console.error('Error:', error);
});