import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';

import { Logger, RequestLoggerMiddleware } from '@shared/infrastructure/logger';
import { setupOpenApiReference } from '@shared/utility/open-api/setup-open-api';
import 'dotenv/config';

import { AppConfig } from './modules/configuration/app';
import { CoreModule } from './modules/core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  logger.setContext('Application');
  app.useLogger(logger);

  const appConfig = app.get(AppConfig);

  logger.info(`Starting application "${appConfig.appName}"`, {
    environment: appConfig.mode,
    version: process.env.npm_package_version || '0.0.1',
    port: appConfig.port,
    nodeVersion: process.version,
  });

  app.use((req, res, next) => {
    const requestLogger = app.get(RequestLoggerMiddleware);
    requestLogger.use(req, res, next);
  });

  const config = new DocumentBuilder()
    .setTitle(appConfig.appName)
    .setDescription(appConfig.description)
    .setVersion('1.0.0')
    .addTag('cars')
    .build();
  setupOpenApiReference(app, config);

  await app.listen(appConfig.port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    logger.info(`Application successfully started on ${url}`, {
      url,
      port: appConfig.port,
    });
  });
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
