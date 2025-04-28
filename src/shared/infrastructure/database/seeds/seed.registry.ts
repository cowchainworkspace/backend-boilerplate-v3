import { Injectable, Logger } from '@nestjs/common';

import { ISeed, ISeedRegistry } from './seed.interface';

/**
 * Registry for seed classes
 */
@Injectable()
export class SeedRegistry implements ISeedRegistry {
  private readonly _logger = new Logger('SeedRegistry');
  private readonly _seeds: ISeed[] = [];

  /**
   * Register a seed with the registry
   * @param seed Seed instance to register
   */
  register(seed: ISeed): void {
    if (this._seeds.find(s => s.name === seed.name)) {
      this._logger.warn(`Seed with name '${seed.name}' is already registered. Skipping.`);
      return;
    }

    this._seeds.push(seed);
    this._logger.log(`Registered seed: ${seed.name}`);
  }

  /**
   * Get all registered seeds
   */
  getAll(): ISeed[] {
    return [...this._seeds];
  }

  /**
   * Get all seeds that should run in the specified environment
   * @param environment Current environment
   */
  getForEnvironment(environment: string): ISeed[] {
    return this._seeds.filter(seed => seed.shouldRunInEnvironment(environment));
  }
}
