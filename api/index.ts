import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from '../src/app/app.module';

const expressServer = express();

let appInitialized = false;

async function bootstrap() {
  if (!appInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();

    appInitialized = true;
  }

  return expressServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}