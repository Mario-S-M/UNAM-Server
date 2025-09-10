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

    // Consultar preguntas con opciones
    const questions = await AppDataSource.query(`
      SELECT 
        fq.id,
        fq."questionText",
        fq."questionType",
        fqo.id as option_id,
        fqo."optionText"
      FROM form_questions fq
      LEFT JOIN form_question_options fqo ON fq.id = fqo."questionId"
      WHERE fq."questionType" IN ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'CHECKBOX')
      ORDER BY fq.id, fqo."orderIndex"
      LIMIT 20;
    `);

    console.log('Questions with options found:', questions.length);
    console.log('Questions:', JSON.stringify(questions, null, 2));

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