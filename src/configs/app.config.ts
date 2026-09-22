import { INestApplication, VersioningType } from '@nestjs/common';

export function AppConfig(app: INestApplication) {
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
}
