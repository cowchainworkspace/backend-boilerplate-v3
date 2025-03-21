import { AppEnvironment } from '@shared/types';
import { loadAndParse } from '@libs/configuration/core/utils';
import { staticConfigSchema, TStaticConfig } from './schema';
import { join } from 'path';

export const staticConfigFiles: Record<AppEnvironment, TStaticConfig> = {
  DEVELOPMENT: loadAndParse(
    join(__dirname, 'config.development.yaml'),
    staticConfigSchema,
  ),
  STAGING: loadAndParse(
    join(__dirname, 'config.staging.yaml'),
    staticConfigSchema,
  ),
  PRODUCTION: loadAndParse(
    join(__dirname, 'config.production.yaml'),
    staticConfigSchema,
  ),
};

export const staticConfig =
  staticConfigFiles[process.env.ENVIRONMENT as AppEnvironment];
