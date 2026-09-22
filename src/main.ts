import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfig } from './configs/app.config.js';
import { SwaggerConfig } from './configs/swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppConfig(app);
  SwaggerConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
