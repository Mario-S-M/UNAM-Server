// Usar fetch nativo de Node.js (disponible desde v18)

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

async function createTestData() {
  try {
    console.log('🚀 Iniciando creación de datos de prueba...');

    // 1. Crear un idioma de prueba
    const createLanguageMutation = `
      mutation CreateLenguage($createLenguageInput: CreateLenguageInput!) {
        createLenguage(createLenguageInput: $createLenguageInput) {
          id
          name
          isActive
        }
      }
    `;

    const languageInput = {
      name: 'Español',
      isActive: true
    };

    console.log('📝 Creando idioma...');
    const languageResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: createLanguageMutation,
        variables: { createLenguageInput: languageInput }
      })
    });

    const languageResult = await languageResponse.json();
    console.log('Resultado idioma:', languageResult);

    if (languageResult.errors) {
      console.log('⚠️ Error al crear idioma (puede que ya exista):', languageResult.errors);
    }

    // 2. Crear un nivel de prueba (necesita lenguageId)
    // Primero obtenemos los idiomas existentes
    const languagesQuery = `
      query GetLenguages {
        lenguages {
          id
          name
          isActive
        }
      }
    `;

    const languagesResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: languagesQuery })
    });

    const languagesResult = await languagesResponse.json();
    const existingLanguages = languagesResult.data?.lenguages || [];
    console.log('Idiomas existentes:', existingLanguages);

    if (existingLanguages.length > 0) {
      const createLevelMutation = `
        mutation CreateLevel($createLevelInput: CreateLevelInput!) {
          createLevel(createLevelInput: $createLevelInput) {
            id
            name
            difficulty
            isActive
            lenguageId
          }
        }
      `;

      const levelInput = {
        name: 'Básico',
        description: 'Nivel básico de aprendizaje',
        difficulty: 'Básico',
        lenguageId: existingLanguages[0].id,
        isActive: true
      };

    console.log('📚 Creando nivel...');
    const levelResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          query: createLevelMutation,
          variables: { createLevelInput: levelInput }
        })
    });

    const levelResult = await levelResponse.json();
    console.log('Resultado nivel:', levelResult);

      if (levelResult.errors) {
        console.log('⚠️ Error al crear nivel (puede que ya exista):', levelResult.errors);
      }
    } else {
      console.log('❌ No hay idiomas disponibles para crear nivel');
    }

    // 3. Crear un usuario/teacher de prueba
    const createUserMutation = `
      mutation Signin($signUpInput: SignupInput!) {
        signin(signUpInput: $signUpInput) {
          user {
            id
            fullName
            email
            roles
          }
          token
        }
      }
    `;

    const userInput = {
      fullName: 'Profesor de Prueba',
      email: 'profesor.prueba@test.com',
      password: 'password123'
    };

    console.log('👨‍🏫 Creando profesor...');
    const userResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: createUserMutation,
        variables: { signUpInput: userInput }
      })
    });

    const userResult = await userResponse.json();
    console.log('Resultado profesor:', userResult);

    if (userResult.errors) {
      console.log('⚠️ Error al crear profesor (puede que ya exista):', userResult.errors);
    }

    // 4. Obtener datos existentes
    console.log('🔍 Obteniendo datos existentes...');
    
    // Obtener idiomas
    const finalLanguagesQuery = `
      query GetLenguages {
        lenguages {
          id
          name
          isActive
        }
      }
    `;

    const finalLanguagesResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: finalLanguagesQuery })
    });

    const finalLanguagesResult = await finalLanguagesResponse.json();
    const languages = finalLanguagesResult.data?.lenguages || [];
    console.log('Idiomas disponibles:', languages);

    // Obtener niveles por idioma (usando query pública)
    const levelsQuery = `
      query GetLevelsByLenguage($lenguageId: ID!) {
        levelsByLenguage(lenguageId: $lenguageId) {
          id
          name
          difficulty
          isActive
          lenguageId
        }
      }
    `;

    let levels = [];
    if (languages.length > 0) {
      const levelsResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: levelsQuery,
          variables: { lenguageId: languages[0].id }
        })
      });

      const levelsResult = await levelsResponse.json();
      levels = levelsResult.data?.levelsByLenguage || [];
    }
    console.log('Niveles disponibles:', levels);

    // Obtener profesores (usando query pública)
    const teachersQuery = `
      query GetTeachers {
        users(roles: [docente]) {
          id
          fullName
          email
          roles
        }
      }
    `;

    const teachersResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: teachersQuery })
    });

    const teachersResult = await teachersResponse.json();
    const teachers = teachersResult.data?.users || [];
    console.log('Profesores disponibles:', teachers);

    // 5. Crear skill si tenemos idioma y nivel
    if (languages.length > 0 && levels.length > 0) {
      const createSkillMutation = `
        mutation CreateSkill($createSkillInput: CreateSkillInput!) {
          createSkill(createSkillInput: $createSkillInput) {
            id
            name
            description
            color
            levelId
            lenguageId
          }
        }
      `;

      const skillInput = {
        name: 'Gramática Básica',
        description: 'Conceptos fundamentales de gramática',
        color: '#3B82F6',
        lenguageId: languages[0].id,
        levelId: levels[0].id
      };

      console.log('🎯 Creando skill...');
      const skillResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: createSkillMutation,
          variables: { createSkillInput: skillInput }
        })
      });

      const skillResult = await skillResponse.json();
      console.log('Resultado skill:', skillResult);

      if (skillResult.errors) {
        console.log('⚠️ Error al crear skill (puede que ya exista):', skillResult.errors);
      }
    }

    // 6. Obtener skills disponibles (usando query pública)
    const skillsQuery = `
      query GetSkillsActivePublic {
        skillsActivePublic {
          id
          name
          description
          color
          isActive
          lenguageId
          levelId
        }
      }
    `;

    const skillsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: skillsQuery })
    });

    const skillsResult = await skillsResponse.json();
    const skills = skillsResult.data?.skillsActivePublic || [];
    console.log('Skills disponibles:', skills);

    // 7. Crear contenido con skillId si tenemos todos los datos (sin requerir profesores)
    if (skills.length > 0 && levels.length > 0) {
      const createContentMutation = `
        mutation CreateContent($createContentInput: CreateContentInput!) {
          createContent(createContentInput: $createContentInput) {
            id
            name
            description
            skillId
            levelId
            validationStatus
          }
        }
      `;

      const contentInput = {
        name: 'Contenido de Prueba con Skill',
        description: 'Este es un contenido de prueba creado para verificar el filtrado por skill',
        skillId: skills[0].id,
        levelId: levels[0].id,
        teacherIds: [], // Array vacío por ahora
        validationStatus: 'APPROVED'
      };

      console.log('📄 Creando contenido con input:', contentInput);

      const createResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: createContentMutation,
          variables: { createContentInput: contentInput }
        })
      });

      const createResult = await createResponse.json();
      console.log('Resultado de creación de contenido:', createResult);

      if (createResult.errors) {
        console.error('❌ Errores al crear contenido:', createResult.errors);
      } else {
        console.log('✅ Contenido creado exitosamente:', createResult.data?.createContent);
      }
    } else {
      console.log('❌ No hay suficientes datos para crear contenido');
      console.log(`Skills: ${skills.length}, Levels: ${levels.length}`);
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

createTestData();