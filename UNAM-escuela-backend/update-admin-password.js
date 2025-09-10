const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function updateAdminPassword() {
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

    // Buscar un usuario superUser
    const superUsers = await client.query(
      "SELECT id, email, \"fullName\", roles FROM users WHERE 'superUser' = ANY(roles) LIMIT 1"
    );
    
    if (superUsers.rows.length === 0) {
      console.log('No se encontraron usuarios superUser');
      return;
    }
    
    const superUser = superUsers.rows[0];
    console.log(`Actualizando contraseña para: ${superUser.email}`);
    
    // Hashear nueva contraseña
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar contraseña
    await client.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, superUser.id]
    );
    
    console.log('✅ Contraseña actualizada exitosamente');
    console.log(`Email: ${superUser.email}`);
    console.log(`Nueva contraseña: ${newPassword}`);
    console.log(`Roles: ${superUser.roles}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

updateAdminPassword();