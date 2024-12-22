import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { setupOpenApiReference } from '@shared/utility/open-api/setup-open-api';
import 'dotenv/config';
import { AppConfig } from './modules/configuration/app';
import { CoreModule } from './modules/core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const config = new DocumentBuilder()
    .setTitle('Cars example')
    .setDescription('The cars API description')
    .setVersion('1.0.0')
    .addTag('cars')
    .build();
  setupOpenApiReference(app, config);

  const logger = new Logger('App');

  const appConfig = app.get(AppConfig);

  await app.listen(appConfig.port, '0.0.0.0', async () =>
    logger.log(`App "API" successfully started on ${await app.getUrl()}`),
  );
}
bootstrap();
