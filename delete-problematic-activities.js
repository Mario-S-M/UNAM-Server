const fetch = require('node-fetch').default;

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

const DELETE_ACTIVITY_MUTATION = `
  mutation RemoveActivity($id: ID!) {
    removeActivity(id: $id) {
      id
      name
    }
  }
`;

// IDs de las actividades problemáticas (las primeras dos que no tienen opciones)
const PROBLEMATIC_ACTIVITY_IDS = [
  'db9ea871-9280-48df-b8e7-209fd8f21528', // Primera actividad sin opciones
  '34360628-9a46-4efb-b839-55ca53916909'  // Segunda actividad sin opciones
];

async function deleteProblematicActivities() {
  try {
    console.log('🗑️  Eliminando actividades problemáticas...');
    
    for (const activityId of PROBLEMATIC_ACTIVITY_IDS) {
      console.log(`\n🔄 Eliminando actividad: ${activityId}`);
      
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: DELETE_ACTIVITY_MUTATION,
          variables: { id: activityId }
        })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.error(`❌ Error eliminando actividad ${activityId}:`, result.errors);
      } else {
        console.log(`✅ Actividad eliminada: ${result.data.removeActivity.name}`);
      }
    }
    
    console.log('\n🎉 Proceso de eliminación completado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteProblematicActivities();