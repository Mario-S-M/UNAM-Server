const fetch = require('node-fetch').default;

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

const LOGIN_MUTATION = `
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        id
        fullName
        email
        roles
        isActive
      }
    }
  }
`;

const CREATE_ACTIVITY_WITH_MULTIPLE_CHOICE = `
  mutation CreateActivity($createActivityInput: CreateActivityInput!) {
    createActivity(createActivityInput: $createActivityInput) {
      id
      name
      description
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
            orderIndex
          }
        }
      }
    }
  }
`;

const GET_CONTENT_ID = `
  query GetContents {
    contents {
      id
      name
    }
  }
`;

async function authenticateUser() {
  try {
    console.log('🔐 Autenticando usuario...');
    const loginResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: {
          loginInput: {
            email: 'admin@unam.mx',
            password: 'admin123'
          }
        }
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResult.errors) {
      console.error('❌ Error de autenticación:', loginResult.errors);
      return null;
    }
    
    console.log('✅ Usuario autenticado:', loginResult.data.login.user.fullName);
    return loginResult.data.login.token;
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    return null;
  }
}

async function testMultipleChoiceCreation() {
  try {
    // 1. Autenticar usuario
    const token = await authenticateUser();
    if (!token) {
      console.log('❌ No se pudo obtener token de autenticación');
      return;
    }
    
    // 2. Obtener contenidos disponibles
    console.log('\n🔍 Obteniendo contenidos disponibles...');
    const contentsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_CONTENT_ID
      })
    });
    
    const contentsResult = await contentsResponse.json();
    
    if (contentsResult.errors) {
      console.error('❌ GraphQL Errors:', contentsResult.errors);
      return;
    }
    
    const contents = contentsResult.data.contents;
    if (!contents || contents.length === 0) {
      console.log('❌ No se encontraron contenidos');
      return;
    }
    
    const contentId = contents[0].id;
    console.log(`✅ Usando contentId: ${contentId}`);
    
    // 3. Crear actividad con preguntas de opción múltiple
    console.log('\n🧪 Creando actividad con pregunta de opción múltiple...');
    
    const createActivityInput = {
      name: "Test Pregunta Múltiple",
      description: "Prueba de pregunta de opción múltiple con múltiples respuestas correctas",
      indication: "Selecciona todas las opciones correctas",
      example: "Ejemplo de pregunta múltiple",
      contentId: contentId,
      questions: [
        {
          questionText: "¿Cuáles de los siguientes son números pares?",
          questionType: "multiple_choice",
          orderIndex: 1,
          isRequired: true,
          allowMultiline: false,
          options: [
            {
              optionText: "2",
              orderIndex: 1,
              isCorrect: true
            },
            {
              optionText: "3",
              orderIndex: 2,
              isCorrect: false
            },
            {
              optionText: "4",
              orderIndex: 3,
              isCorrect: true
            },
            {
              optionText: "5",
              orderIndex: 4,
              isCorrect: false
            },
            {
              optionText: "6",
              orderIndex: 5,
              isCorrect: true
            }
          ]
        },
        {
          questionText: "¿Cuál es la capital de Francia?",
          questionType: "single_choice",
          orderIndex: 2,
          isRequired: true,
          allowMultiline: false,
          options: [
            {
              optionText: "Londres",
              orderIndex: 1,
              isCorrect: false
            },
            {
              optionText: "París",
              orderIndex: 2,
              isCorrect: true
            },
            {
              optionText: "Madrid",
              orderIndex: 3,
              isCorrect: false
            },
            {
              optionText: "Roma",
              orderIndex: 4,
              isCorrect: false
            }
          ]
        }
      ]
    };
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: CREATE_ACTIVITY_WITH_MULTIPLE_CHOICE,
        variables: { createActivityInput }
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }
    
    console.log('\n✅ Actividad creada exitosamente:');
    console.log('ID:', result.data.createActivity.id);
    console.log('Nombre:', result.data.createActivity.name);
    
    console.log('\n📋 Verificando creación de preguntas...');
    
    // Consultar la actividad creada para verificar las preguntas
    const GET_ACTIVITY_QUERY = `
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
    
    const activityResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_ACTIVITY_QUERY,
        variables: { id: result.data.createActivity.id }
      })
    });
    
    const activityResult = await activityResponse.json();
    
    if (activityResult.errors) {
      console.log('❌ Error al consultar actividad:', activityResult.errors);
      return;
    }
    
    const activity = activityResult.data.activity;
    
    if (activity.form && activity.form.questions) {
      activity.form.questions.forEach((question, index) => {
        console.log(`\n${index + 1}. ${question.questionText}`);
        console.log(`   Tipo: ${question.questionType}`);
        console.log('   Opciones:');
        
        if (question.options) {
          question.options.forEach((option, optIndex) => {
            const correctMark = option.isCorrect ? '✅' : '❌';
            console.log(`     ${optIndex + 1}. ${option.optionText} ${correctMark}`);
          });
          
          // Verificar que hay opciones correctas
          const correctOptions = question.options.filter(opt => opt.isCorrect);
          console.log(`   📊 Opciones correctas: ${correctOptions.length}`);
          
          if (question.questionType === 'multiple_choice' && correctOptions.length < 2) {
            console.log('   ⚠️  ADVERTENCIA: Pregunta de opción múltiple debería tener al menos 2 opciones correctas');
          }
          
          if (question.questionType === 'single_choice' && correctOptions.length !== 1) {
            console.log('   ⚠️  ADVERTENCIA: Pregunta de selección única debería tener exactamente 1 opción correcta');
          }
        }
      });
    } else {
      console.log('❌ No se encontraron preguntas en la actividad');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMultipleChoiceCreation();