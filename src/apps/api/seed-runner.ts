import { NestFactory } from '@nestjs/core';

import { SeedRunner } from '@shared/infrastructure/database/seeds/seed.runner';
import { Logger } from '@shared/infrastructure/logger';
import { AppEnvironment } from '@shared/types';
import { config } from 'dotenv';

import { CoreModule } from './modules/core/core.module';

config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(CoreModule, {
      bufferLogs: true,
    });

    const logger = app.get(Logger);
    logger.setContext('SeedRunner');
    app.useLogger(logger);

    logger.info('Starting seed process...');

    const seedRunner = app.get(SeedRunner);

    const environment = (process.env.ENVIRONMENT as AppEnvironment) || AppEnvironment.DEVELOPMENT;
    logger.info(`Running seeds for environment: ${environment}`);

    const args = process.argv.slice(2);
    const forceOption = args.includes('--force');

    await seedRunner.runAll({ force: forceOption });

    logger.info('Seed process completed successfully');
    await app.close();
  } catch (error) {
    console.error(`Seed process failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
