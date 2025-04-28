import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from '@shared/infrastructure/database/drizzle/constants/injection-tokens';
import { TDatabaseSchema } from '@shared/infrastructure/database/schemas';
import { cars } from '@shared/infrastructure/database/schemas/cars';
import { BaseSeed } from '@shared/infrastructure/database/seeds/base.seed';
import { ISeedRunOptions } from '@shared/infrastructure/database/seeds/seed.interface';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class CarsSeed extends BaseSeed {
  constructor(
    @Inject(DRIZZLE_DATASOURCE_PROVIDER_TOKEN)
    private readonly _db: NodePgDatabase<TDatabaseSchema>,
  ) {
    super('Cars', {
      strategy: 'RECREATE',

      environments: ['ALL'],

      useTransaction: true,
    });
  }

  async run(options?: ISeedRunOptions): Promise<void> {
    this.logger.log('Seeding cars...');

    if (options?.force) {
      this.logger.debug(
        'Force option enabled, proceeding with seeding cars regardless of existing data',
      );
    }

    await this._db.delete(cars);

    const carsData = [
      {
        model: 'Tesla Model S',
        ridesCount: 15,
      },
      {
        model: 'BMW i8',
        ridesCount: 7,
      },
      {
        model: 'Audi e-tron',
        ridesCount: 3,
      },
      {
        model: 'Porsche Taycan',
        ridesCount: 0,
      },
      {
        model: 'Mercedes-Benz EQS',
        ridesCount: 10,
      },
    ];

    for (const car of carsData) {
      await this._db.insert(cars).values(car);
    }

    this.logger.log('Cars seeded successfully');
  }

  async cleanup(): Promise<void> {
    this.logger.log('Cleaning up cars seed data...');

    await this._db.delete(cars);

    this.logger.log('Cars seed data cleaned up');
  }
}
