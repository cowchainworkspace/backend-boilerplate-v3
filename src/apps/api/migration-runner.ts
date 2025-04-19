import { NestFactory } from '@nestjs/core';

import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from '@shared/infrastructure/database/drizzle/constants/injection-tokens';
import { Logger } from '@shared/infrastructure/logger';
import { config } from 'dotenv';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';

import { DatabaseSetupModule } from './modules/database-setup/database-setup.module';

config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(DatabaseSetupModule, {
      bufferLogs: true,
    });

    const logger = app.get(Logger);
    logger.setContext('MigrationRunner');
    app.useLogger(logger);

    const db = app.get<NodePgDatabase>(DRIZZLE_DATASOURCE_PROVIDER_TOKEN);

    logger.info('Starting database migration...');

    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    logger.info(`Using migrations folder: ${migrationsFolder}`);

    await migrate(db, { migrationsFolder });

    logger.info('Database migration completed successfully');

    await app.close();
  } catch (error) {
    console.error(`Database migration failed: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
