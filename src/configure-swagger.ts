import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('CampusRate API')
    .setDescription(
      'Une API REST qui permet les étudiants de consulter divers places dans leur campus et de partager leurs opinions',
    )
    .setVersion('1')
    .addTag('Places', 'Gestion des endroits évalués')
    .addTag('Reviews', 'Gestion des appréciations')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/openapi.json',
    customSiteTitle: 'CampusRate API — Documentation',
  });
}
