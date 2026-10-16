import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfig } from './configs/app.config.js';
import { SwaggerConfig } from './configs/swagger.config.js';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

async function bootstrap() {
  if (fs.existsSync('.env')) {
    process.loadEnvFile();
  }

  if (!process.env.KEY_PATH || !process.env.CERT_PATH) {
    throw new InternalServerErrorException('Missing Key and Certificate');
  }

  const httpsOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions,
  });

  AppConfig(app);
  SwaggerConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
