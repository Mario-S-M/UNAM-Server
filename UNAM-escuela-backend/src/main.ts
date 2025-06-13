import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:11434',
      'http://132.247.186.91',
      'http://132.247.186.91:3000',
      'http://132.247.186.91:80',
      'http://132.247.186.91:11434',
      'http://132.247.186.91',
      'http://frontend',
      /^http:\/\/132\.247\.186\.91(:\d+)?$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Apollo-Require-Preflight',
    ],
  });

  await app.listen(3000);
}
bootstrap();
