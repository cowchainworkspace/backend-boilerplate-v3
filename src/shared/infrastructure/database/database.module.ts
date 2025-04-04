import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Pool } from 'pg';
import { DatabaseConfig } from './configs';
import { DrizzleModule } from './drizzle';
import { DatabaseHealthService } from './health/health.service';
import { REPOSITORIES } from './repositories';
import { databaseSchema } from './schemas';

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
  providers: [DatabaseHealthService, ...REPOSITORIES],
  exports: [DatabaseHealthService, ...REPOSITORIES],
})
export class DatabaseModule {}
