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
      'http://localhost:80',
      'http://132.247.186.91',
      'http://132.247.186.91:3000',
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
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
