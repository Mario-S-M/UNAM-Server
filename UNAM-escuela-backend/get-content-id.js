const { Client } = require('pg');

async function getContentId() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'MySecretPassword123@',
    database: 'unam_escuela'
  });

  try {
    await client.connect();
    const result = await client.query('SELECT id FROM contents LIMIT 1');
    
    if (result.rows.length > 0) {
      console.log('Content ID found:', result.rows[0].id);
      return result.rows[0].id;
    } else {
      console.log('No contents found in database');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

getContentId();