import 'dotenv/config'; // load .env before any module initializes
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,      // auto-transform payloads to DTO classes
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
