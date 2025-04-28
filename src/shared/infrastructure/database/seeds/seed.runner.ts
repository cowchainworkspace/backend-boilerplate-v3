import { Inject, Injectable, Logger } from '@nestjs/common';

import { AppConfig } from '@apps/api/modules/configuration/app';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from '../drizzle/constants/injection-tokens';
import { TDatabaseSchema } from '../schemas';
import { ISeed, ISeedRunOptions, ISeedRunner } from './seed.interface';
import { SeedRegistry } from './seed.registry';

/**
 * Responsible for running seeds in the correct order and with proper transactions
 */
@Injectable()
export class SeedRunner implements ISeedRunner {
  private readonly _logger = new Logger('SeedRunner');

  constructor(
    private readonly seedRegistry: SeedRegistry,
    @Inject(DRIZZLE_DATASOURCE_PROVIDER_TOKEN)
    private readonly _db: NodePgDatabase<TDatabaseSchema>,
    private readonly _appConfig: AppConfig,
  ) {}

  /**
   * Run all seeds for the current environment
   * @param options Options for running seeds
   */
  async runAll(options?: ISeedRunOptions): Promise<void> {
    const environment = this._appConfig.mode;
    const seeds = this.seedRegistry.getForEnvironment(environment);

    if (seeds.length === 0) {
      this._logger.log(`No seeds found for environment: ${environment}`);
      return;
    }

    this._logger.log(`Running ${seeds.length} seeds for environment: ${environment}`);

    // Якщо вказана опція force - логуємо це
    if (options?.force) {
      this._logger.log('Force mode enabled: will run all seeds regardless of conditions');
    }

    await this.run(seeds, options);
  }

  /**
   * Run the specified seeds
   * @param seeds Array of seeds to run
   * @param options Options for running seeds
   */
  async run(seeds: ISeed[], options?: ISeedRunOptions): Promise<void> {
    for (const seed of seeds) {
      try {
        // Якщо force=true, пропускаємо перевірку умови
        const shouldRun = options?.force ? true : await seed.shouldRun();

        if (!shouldRun) {
          this._logger.log(`Skipping seed ${seed.name} due to condition check`);
          continue;
        }

        this._logger.log(`Running seed: ${seed.name}`);

        if (seed.options.useTransaction) {
          await this._db.transaction(async tx => {
            (seed as any).transaction = tx;
            await seed.run(options);
            delete (seed as any).transaction;
          });
        } else {
          await seed.run(options);
        }

        this._logger.log(`Completed seed: ${seed.name}`);
      } catch (error) {
        this._logger.error(`Failed to run seed ${seed.name}: ${error.message}`, error.stack);

        if (!seed.options.useTransaction) {
          this._logger.warn(
            `Seed ${seed.name} was not run in a transaction, data may be partially seeded.`,
          );
        }

        throw error;
      }
    }
  }

  /**
   * Cleanup seeds (useful for testing)
   * @param seeds Array of seeds to clean up
   */
  async cleanup(seeds: ISeed[]): Promise<void> {
    for (const seed of seeds) {
      if (typeof seed.cleanup === 'function') {
        try {
          this._logger.log(`Cleaning up seed: ${seed.name}`);
          await seed.cleanup();
          this._logger.log(`Completed cleanup for seed: ${seed.name}`);
        } catch (error) {
          this._logger.error(`Failed to clean up seed ${seed.name}: ${error.message}`, error.stack);
          throw error;
        }
      }
    }
  }
}
