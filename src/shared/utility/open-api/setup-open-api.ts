import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { apiReference } from '@scalar/nestjs-api-reference';

export const setupOpenApiReference = (
  app: INestApplication,
  config: ReturnType<DocumentBuilder['build']>,
) => {
  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      theme: 'purple',
      spec: {
        content: document,
      },
    }),
  );
};
