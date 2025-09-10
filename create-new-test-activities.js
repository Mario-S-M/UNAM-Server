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

const CREATE_ACTIVITY_MUTATION = `
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
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ Login Errors:', result.errors);
      return null;
    }
    
    console.log('✅ Usuario autenticado:', result.data.login.user.fullName);
    return result.data.login.token;
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    return null;
  }
}

async function createNewTestActivities() {
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
    
    // 3. Crear primera actividad de reemplazo
    console.log('\n🧪 Creando primera actividad de reemplazo...');
    
    const firstActivityInput = {
      name: "Examen de Matemáticas - Pregunta 1",
      description: "Primera pregunta del examen de matemáticas básicas",
      indication: "Selecciona la respuesta correcta",
      example: "Ejemplo: ¿Cuánto es 1+1? Respuesta: 2",
      contentId: contentId,
      questions: [
        {
          questionText: "¿Cuál es el resultado de 2 + 3?",
          questionType: "single_choice",
          orderIndex: 1,
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
    
    const firstResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: CREATE_ACTIVITY_MUTATION,
        variables: { createActivityInput: firstActivityInput }
      })
    });
    
    const firstResult = await firstResponse.json();
    
    if (firstResult.errors) {
      console.error('❌ Error creando primera actividad:', firstResult.errors);
    } else {
      console.log('✅ Primera actividad creada:', firstResult.data.createActivity.name);
      console.log('   ID:', firstResult.data.createActivity.id);
    }
    
    // 4. Crear segunda actividad de reemplazo
    console.log('\n🧪 Creando segunda actividad de reemplazo...');
    
    const secondActivityInput = {
      name: "Examen de Matemáticas - Pregunta 2",
      description: "Segunda pregunta del examen de matemáticas básicas",
      indication: "Selecciona todas las opciones correctas",
      example: "Ejemplo: ¿Cuáles son números pares? Respuesta: 2, 4, 6",
      contentId: contentId,
      questions: [
        {
          questionText: "¿Cuáles de los siguientes números son mayores que 5?",
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
              optionText: "6",
              orderIndex: 2,
              isCorrect: true
            },
            {
              optionText: "4",
              orderIndex: 3,
              isCorrect: false
            },
            {
              optionText: "8",
              orderIndex: 4,
              isCorrect: true
            },
            {
              optionText: "2",
              orderIndex: 5,
              isCorrect: false
            }
          ]
        }
      ]
    };
    
    const secondResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: CREATE_ACTIVITY_MUTATION,
        variables: { createActivityInput: secondActivityInput }
      })
    });
    
    const secondResult = await secondResponse.json();
    
    if (secondResult.errors) {
      console.error('❌ Error creando segunda actividad:', secondResult.errors);
    } else {
      console.log('✅ Segunda actividad creada:', secondResult.data.createActivity.name);
      console.log('   ID:', secondResult.data.createActivity.id);
    }
    
    console.log('\n🎉 Proceso completado. Las nuevas actividades están listas para usar.');
    console.log('\n🌐 Puedes probar las actividades en: http://localhost:3001');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createNewTestActivities();