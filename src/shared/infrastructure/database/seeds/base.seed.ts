import { Logger } from '@nestjs/common';

import { ISeed, ISeedOptions } from './seed.interface';

/**
 * Base abstract class for all seeds
 */
export abstract class BaseSeed implements ISeed {
  protected readonly logger: Logger;

  /**
   * @param name Unique name of the seed
   * @param options Seed configuration options
   */
  constructor(
    public readonly name: string,
    public readonly options: ISeedOptions,
  ) {
    this.logger = new Logger(`Seed:${name}`);
  }

  /**
   * Check if this seed should run in the current environment
   * @param environment Current environment
   */
  public shouldRunInEnvironment(environment: string): boolean {
    return (
      this.options.environments.includes('ALL') || this.options.environments.includes(environment)
    );
  }

  /**
   * Check if the seed should run based on custom condition
   */
  public async shouldRun(): Promise<boolean> {
    if (this.options.condition) {
      return this.options.condition();
    }
    return true;
  }

  /**
   * Execute the seed - must be implemented by concrete seed classes
   */
  public abstract run(): Promise<void>;

  /**
   * Optional cleanup method - can be overridden by concrete seed classes
   */
  public async cleanup(): Promise<void> {
    this.logger.log(`No cleanup implemented for seed: ${this.name}`);
  }
}
