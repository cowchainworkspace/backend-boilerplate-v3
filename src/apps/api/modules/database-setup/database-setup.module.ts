import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { DatabaseConfig } from '@shared/infrastructure/database/configs';
import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from '@shared/infrastructure/database/drizzle/constants/injection-tokens';
import { databaseSchema } from '@shared/infrastructure/database/schemas';
import { SeedRegistry } from '@shared/infrastructure/database/seeds/seed.registry';
import { SeedRunner } from '@shared/infrastructure/database/seeds/seed.runner';
import { LoggerModule } from '@shared/infrastructure/logger/logger.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, TerminusModule, LoggerModule],
  providers: [
    {
      provide: DRIZZLE_DATASOURCE_PROVIDER_TOKEN,
      inject: [DatabaseConfig],
      useFactory: (databaseConfig: DatabaseConfig) => {
        const pgPool = new Pool({
          connectionString: databaseConfig.connectionString,
        });
        return drizzle(pgPool, { schema: databaseSchema });
      },
    },
    SeedRegistry,
    SeedRunner,
  ],
  exports: [DRIZZLE_DATASOURCE_PROVIDER_TOKEN, SeedRegistry, SeedRunner],
})
export class DatabaseSetupModule {}
