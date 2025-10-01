const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'MySecretPassword123@',
  database: 'unam_escuela',
  synchronize: false,
  logging: true,
});

async function checkQuestions() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // Consultar preguntas con audioUrl
    const questionsWithAudio = await AppDataSource.query(`
      SELECT 
        id,
        "questionText",
        "questionType",
        "audioUrl"
      FROM form_questions
      WHERE "audioUrl" IS NOT NULL AND "audioUrl" != ''
      ORDER BY id;
    `);

    console.log('Questions with audioUrl found:', questionsWithAudio.length);
    console.log('Questions with audio:', JSON.stringify(questionsWithAudio, null, 2));

    // Consultar todas las preguntas para ver el estado general
    const allQuestions = await AppDataSource.query(`
      SELECT 
        id,
        "questionText",
        "questionType",
        "audioUrl",
        "description"
      FROM form_questions
      ORDER BY id
      LIMIT 10;
    `);

    console.log('\nFirst 10 questions (general overview):', JSON.stringify(allQuestions, null, 2));

    // Contar preguntas por tipo
    const counts = await AppDataSource.query(`
      SELECT 
        "questionType",
        COUNT(*) as count
      FROM form_questions
      GROUP BY "questionType";
    `);

    console.log('Question counts by type:', counts);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkQuestions();