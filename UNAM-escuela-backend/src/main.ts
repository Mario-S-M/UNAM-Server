import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(
    {
      origin: [
        'http://localhost', 
        'http://132.247.186.91'
      ],
      credentials: true
    }
  );

  await app.listen(3000);
}
bootstrap();