// Using native fetch (Node.js 18+)

// Test creating an activity from frontend
async function testCreateActivity() {
  try {
    console.log('🔍 Testing activity creation...');
    
    // First, get available contents
    const contentsQuery = `
      query GetContents {
        contentsPaginated(page: 1, limit: 10, validationStatus: "APPROVED") {
          contents {
            id
            name
            description
            validationStatus
            skill {
              id
              name
              color
            }
          }
          total
        }
      }
    `;

    console.log('📋 Fetching available contents...');
    const contentsResponse = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: contentsQuery,
      }),
    });

    const contentsData = await contentsResponse.json();
    console.log('📄 Contents response:', JSON.stringify(contentsData, null, 2));

    if (contentsData.data && contentsData.data.contentsPaginated && contentsData.data.contentsPaginated.contents.length > 0) {
      const firstContent = contentsData.data.contentsPaginated.contents[0];
      console.log(`\n🎯 Using content: ${firstContent.name} (${firstContent.id})`);

      // Now create an activity
      const createActivityMutation = `
        mutation CreateActivity($createActivityInput: CreateActivityInput!) {
          createActivity(createActivityInput: $createActivityInput) {
            id
            name
            description
            indication
            example
            contentId
            formId
            form {
              id
              title
              questions {
                id
                text
                type
                required
                options {
                  id
                  text
                  value
                }
              }
            }
            createdAt
            updatedAt
          }
        }
      `;

      const activityData = {
        name: "Actividad de Prueba - Preguntas de Texto",
        description: "Esta es una actividad de prueba para probar preguntas de texto abierto",
        indication: "Responde las preguntas de forma clara y concisa",
        example: "Ejemplo: Escribe tu respuesta aquí",
        contentId: firstContent.id
      };

      console.log('\n🚀 Creating activity with data:', JSON.stringify(activityData, null, 2));
      
      const createResponse = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: createActivityMutation,
          variables: {
            createActivityInput: activityData
          }
        }),
      });

      const createResult = await createResponse.json();
      console.log('\n✅ Activity creation result:', JSON.stringify(createResult, null, 2));

      if (createResult.data && createResult.data.createActivity) {
        const newActivity = createResult.data.createActivity;
        console.log(`\n🎉 Activity created successfully!`);
        console.log(`   ID: ${newActivity.id}`);
        console.log(`   Name: ${newActivity.name}`);
        console.log(`   Content ID: ${newActivity.contentId}`);
        console.log(`\n🔗 You can now navigate to: http://localhost:3001/teacher/activities/questions/${newActivity.id}`);
        
        return newActivity.id;
      } else {
        console.log('❌ Failed to create activity');
        if (createResult.errors) {
          console.log('Errors:', createResult.errors);
        }
      }
    } else {
      console.log('❌ No approved contents found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testCreateActivity();