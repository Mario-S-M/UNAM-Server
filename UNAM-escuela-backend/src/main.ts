import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('Starting NestJS application...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Configurar archivos estáticos para las imágenes
    app.useStaticAssets(join(__dirname, '..', '..', 'Imagenes'), {
      prefix: '/images/',
    });

    // Mantener compatibilidad con uploads existentes
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });
    logger.log('Configuring CORS...');
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://eskani.enesmorelia.unam.mx',
        'https://enesmorelia.unam.mx',
        'http://132.247.186.91',
        'http://132.247.186.91:50001',
        'https://132.247.186.91:50001',
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
        'Access-Control-Allow-Origin',
      ],
    });

    const port = process.env.PORT || 3000;
    logger.log(`Starting server on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    logger.log(`Server started successfully on http://0.0.0.0:${port}`);
    
    // Signal PM2 that the app is ready
    if (process.send) {
      process.send('ready');
    }
  } catch (error) {
    logger.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
