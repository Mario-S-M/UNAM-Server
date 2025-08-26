const { Client } = require('pg');

async function createContent() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'MySecretPassword123@',
    database: 'unam_escuela',
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    // Verificar si ya existen contenidos
    const existingContents = await client.query('SELECT COUNT(*) FROM contents');
    console.log('Contenidos existentes:', existingContents.rows[0].count);
    
    if (parseInt(existingContents.rows[0].count) > 0) {
      console.log('Ya existen contenidos en la base de datos');
      return;
    }

    // Obtener el ID del usuario admin
    const adminUser = await client.query(
      "SELECT id FROM users WHERE email = 'admin@unam.mx'"
    );
    
    if (adminUser.rows.length === 0) {
      console.log('No se encontró el usuario administrador');
      return;
    }
    
    const adminId = adminUser.rows[0].id;
    console.log('ID del administrador:', adminId);

    // Crear contenidos de ejemplo
    const sampleContents = [
      {
        name: 'Introducción al Inglés Básico',
        description: 'Contenido introductorio para aprender inglés desde cero',
        type: 'lesson',
        status: 'validated'
      },
      {
        name: 'Gramática Inglesa Intermedia',
        description: 'Lecciones de gramática para nivel intermedio',
        type: 'lesson',
        status: 'validated'
      },
      {
        name: 'Conversación en Inglés Avanzado',
        description: 'Práctica de conversación para nivel avanzado',
        type: 'conversation',
        status: 'validated'
      },
      {
        name: 'Vocabulario Técnico',
        description: 'Vocabulario especializado para diferentes áreas',
        type: 'vocabulary',
        status: 'validated'
      },
      {
        name: 'Comprensión de Lectura',
        description: 'Ejercicios para mejorar la comprensión lectora',
        type: 'reading',
        status: 'validated'
      }
    ];

    for (const content of sampleContents) {
      const result = await client.query(
        `INSERT INTO contents (id, name, description, type, status, "createdBy", "isActive", "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW()) 
         RETURNING id, name`,
        [content.name, content.description, content.type, content.status, adminId]
      );
      
      console.log(`Contenido creado: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }

    console.log('\n✅ Contenidos de ejemplo creados exitosamente');
    
  } catch (error) {
    console.error('Error creando contenidos de ejemplo:', error.message);
  } finally {
    await client.end();
  }
}

createContent();