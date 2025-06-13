import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    console.log('Configuring CORS...');
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

    console.log('Starting server on port 3000...');
    await app.listen(3000, '0.0.0.0');
    console.log('Server started successfully on http://0.0.0.0:3000');
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
