import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SeedRegistry } from '@shared/infrastructure/database/seeds/seed.registry';
import { SeedRunner } from '@shared/infrastructure/database/seeds/seed.runner';
import { config } from 'dotenv';

import { AppConfig } from './modules/configuration/app';
import { CoreModule } from './modules/core/core.module';

config();

async function bootstrap() {
  const logger = new Logger('SeedCleanup');

  try {
    const app = await NestFactory.create(CoreModule);
    const seedRegistry = app.get(SeedRegistry);
    const seedRunner = app.get(SeedRunner);
    const appConfig = app.get(AppConfig);

    const environment = appConfig.mode;
    const seeds = seedRegistry.getForEnvironment(environment);

    if (seeds.length === 0) {
      logger.log(`No seeds found for environment: ${environment}`);
      await app.close();
      process.exit(0);
      return;
    }

    logger.log(`Starting cleanup for ${seeds.length} seeds in environment: ${environment}`);
    await seedRunner.cleanup(seeds);
    logger.log('Seed cleanup completed successfully');

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Seed cleanup failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
