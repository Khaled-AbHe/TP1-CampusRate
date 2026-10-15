import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ProblemDetailsFilter } from '../common/problemDetails/filter/problem-details.filter.js';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

export function AppConfig(app: INestApplication) {
  const config = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ProblemDetailsFilter());
}
