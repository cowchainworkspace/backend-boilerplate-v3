import { loadAndParse } from '@libs/configuration/core/utils';
import { AppEnvironment } from '@shared/types';
import { config } from 'dotenv';
import { join } from 'path';

import { TStaticConfig, staticConfigSchema } from './schema';

config();

export const staticConfigFiles: Record<AppEnvironment, TStaticConfig> = {
  DEVELOPMENT: loadAndParse(join(__dirname, 'config.development.yaml'), staticConfigSchema),
  STAGING: loadAndParse(join(__dirname, 'config.staging.yaml'), staticConfigSchema),
  PRODUCTION: loadAndParse(join(__dirname, 'config.production.yaml'), staticConfigSchema),
};

const environment = (process.env.ENVIRONMENT as AppEnvironment) || AppEnvironment.DEVELOPMENT;
console.log(`Loading configuration for environment: ${environment}`);

export const staticConfig = staticConfigFiles[environment];
