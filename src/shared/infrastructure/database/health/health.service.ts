import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from '../drizzle/constants/injection-tokens';
import { TDatabaseSchema } from '../schemas';

@Injectable()
export class DatabaseHealthService {
  @Inject(DRIZZLE_DATASOURCE_PROVIDER_TOKEN)
  protected readonly _drizzle: NodePgDatabase<TDatabaseSchema>;

  constructor(
    @Inject()
    private readonly _healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this._healthIndicatorService.check(key);
    try {
      const isHealthy = await this._drizzle.execute('SELECT 1');

      if (!isHealthy) {
        return indicator.down({
          message: 'Database is not connected',
        });
      }

      return indicator.up();
    } catch (error) {
      if (error instanceof Error) {
        return indicator.down({
          message: error.message,
        });
      } else {
        return indicator.down({
          message: 'Database is not connected',
        });
      }
    }
  }
}
