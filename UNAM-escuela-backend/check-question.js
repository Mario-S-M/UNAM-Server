const { createConnection } = require('typeorm');
const { FormQuestion } = require('./dist/forms/entities/form-question.entity');
const { FormQuestionOption } = require('./dist/forms/entities/form-question-option.entity');

(async () => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
    });
    
    const questionRepository = connection.getRepository('FormQuestion');
    
    // Buscar preguntas que contengan 'verb' o 'verbo'
    const questions = await questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .where('question.questionText ILIKE :text1', { text1: '%verb%' })
      .orWhere('question.questionText ILIKE :text2', { text2: '%verbo%' })
      .getMany();
    
    console.log('Preguntas encontradas:', questions.length);
    
    questions.forEach((question, index) => {
      console.log(`\n--- Pregunta ${index + 1} ---`);
      console.log('ID:', question.id);
      console.log('Texto:', question.questionText);
      console.log('Tipo:', question.questionType);
      console.log('Opciones:');
      
      if (question.options && question.options.length > 0) {
        question.options.forEach((option, optIndex) => {
          console.log(`  ${optIndex + 1}. ${option.optionText} (isCorrect: ${option.isCorrect})`);
        });
      } else {
        console.log('  No hay opciones');
      }
    });
    
    await connection.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
})();