import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { setupOpenApiReference } from '@shared/utility/open-api/setup-open-api';
import 'dotenv/config';
import { AppConfig } from './modules/configuration/app';
import { CoreModule } from './modules/core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const logger = new Logger('App');

  const appConfig = app.get(AppConfig);

  const config = new DocumentBuilder()
    .setTitle(appConfig.appName)
    .setDescription(appConfig.description)
    .setVersion('1.0.0')
    .addTag('cars')
    .build();
  setupOpenApiReference(app, config);

  await app.listen(appConfig.port, '0.0.0.0', async () =>
    logger.log(`App "API" successfully started on ${await app.getUrl()}`),
  );
}
bootstrap();
