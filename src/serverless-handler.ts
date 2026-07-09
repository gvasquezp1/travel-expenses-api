import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

import { AppModule } from './app/app.module'; 
import { JwtAuthGuard } from './app/auth/guards/jwt-auth.guard'; 

const expressApp = express();
let appInitialized = false;

async function bootstrap() {
  if (!appInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    const config = new DocumentBuilder()
      .setTitle('Viáticos API')
      .setDescription('Gestión Viáticos API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors({
      origin: [
        'http://localhost:4200',
        process.env.FRONTEND_URL,
      ].filter(Boolean) as string[],
      credentials: true,
    });

    await app.init();
    appInitialized = true;
  }

  return expressApp;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
