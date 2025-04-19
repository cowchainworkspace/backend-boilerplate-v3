import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { Pool } from 'pg';

import { DatabaseConfig } from './configs';
import { DrizzleModule } from './drizzle';
import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from './drizzle/constants/injection-tokens';
import { DatabaseHealthService } from './health/health.service';
import { REPOSITORIES } from './repositories';
import { databaseSchema } from './schemas';
import { SeedRegistry } from './seeds/seed.registry';
import { SeedRunner } from './seeds/seed.runner';

@Module({
  imports: [
    TerminusModule,
    DrizzleModule.registerAsync({
      inject: [DatabaseConfig],
      useFactory: (databaseConfig: DatabaseConfig) => {
        const pgPool = new Pool({
          connectionString: databaseConfig.connectionString,
        });
        return [{ client: pgPool, schema: databaseSchema }];
      },
    }),
  ],
  providers: [DatabaseHealthService, ...REPOSITORIES, SeedRegistry, SeedRunner],
  exports: [DatabaseHealthService, ...REPOSITORIES, DrizzleModule, SeedRegistry, SeedRunner],
})
export class DatabaseModule {}
