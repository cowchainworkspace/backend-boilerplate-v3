/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export const CORRELATION_ID_HEADER = 'X-Correlation-ID';
export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';
export const APP_LOGGER = 'AppLogger';
export const LOGGER_CONTEXT_TOKEN = 'LOGGER_CONTEXT';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  VERBOSE = 'verbose',
  LOG = 'info',
}

export interface ILoggerMetadata {
  [key: string]: any;
  correlationId?: string;
  service?: string;
  version?: string;
  env?: string;
  timestamp?: string;
  context?: string;
}
