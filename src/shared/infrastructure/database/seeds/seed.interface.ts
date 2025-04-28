export interface ISeedOptions {
  strategy: 'UPSERT' | 'INSERT_ONCE' | 'RECREATE';

  environments: Array<string | 'ALL'>;

  useTransaction: boolean;

  condition?: () => Promise<boolean> | boolean;
}

export interface ISeedRunOptions {
  force?: boolean;
}

export interface ISeed {
  readonly name: string;

  readonly options: ISeedOptions;

  run(runOptions?: ISeedRunOptions): Promise<void>;

  cleanup?(): Promise<void>;

  shouldRun(): Promise<boolean>;

  /**
   * Check if this seed should run in the current environment
   * @param environment Current environment
   */
  shouldRunInEnvironment(environment: string): boolean;
}

export interface ISeedRegistry {
  register(seed: ISeed): void;

  getAll(): ISeed[];

  getForEnvironment(environment: string): ISeed[];
}

export interface ISeedRunner {
  runAll(options?: ISeedRunOptions): Promise<void>;

  run(seeds: ISeed[], options?: ISeedRunOptions): Promise<void>;

  cleanup(seeds: ISeed[]): Promise<void>;
}
