import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    logger.log('Configuring CORS...');
    app.enableCors({
      origin: [
        'http://localhost',
        'http://localhost:3000',
        'http://localhost:11434',
        'http://132.247.186.91',
        'http://132.247.186.91:80',
        'http://132.247.186.91:11434',
        'http://frontend',
        /^http:\/\/localhost(:\d+)?$/,
        /^http:\/\/132\.247\.186\.91(:\d+)?$/,
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Apollo-Require-Preflight',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      optionsSuccessStatus: 200,
    });

    logger.log('Starting server on port 3000...');
    await app.listen(3000, '0.0.0.0');
    logger.log('Server started successfully on http://0.0.0.0:3000');
  } catch (error) {
    logger.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
