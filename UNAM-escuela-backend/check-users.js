const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function checkUsers() {
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

    // Verificar usuarios existentes
    const users = await client.query(
      "SELECT id, email, \"fullName\", roles, password FROM users WHERE email LIKE '%admin%' OR 'admin' = ANY(roles) OR 'superUser' = ANY(roles)"
    );
    
    console.log('Usuarios admin encontrados:', users.rows.length);
    
    for (const user of users.rows) {
      console.log(`\nUsuario: ${user.email}`);
      console.log(`Nombre: ${user.fullName}`);
      console.log(`Roles: ${user.roles}`);
      console.log(`ID: ${user.id}`);
      
      // Probar contraseñas comunes
      const commonPasswords = ['admin', '123456', 'password', 'admin123', 'unam123', 'MySecretPassword123@'];
      
      for (const password of commonPasswords) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          console.log(`✅ Contraseña encontrada: ${password}`);
          break;
        }
      }
    }
    
    // Si no hay usuarios admin, crear uno
    if (users.rows.length === 0) {
      console.log('\nNo se encontraron usuarios admin. Creando uno...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = await client.query(
        `INSERT INTO users (id, email, \"fullName\", password, roles, \"isActive\", \"createdAt\", \"updatedAt\") 
         VALUES (gen_random_uuid(), 'admin@unam.mx', 'Administrador', $1, ARRAY['admin', 'superUser'], true, NOW(), NOW()) 
         RETURNING id, email, \"fullName\", roles`,
        [hashedPassword]
      );
      
      console.log('✅ Usuario admin creado:');
      console.log(`Email: ${newAdmin.rows[0].email}`);
      console.log(`Contraseña: admin123`);
      console.log(`Roles: ${newAdmin.rows[0].roles}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();