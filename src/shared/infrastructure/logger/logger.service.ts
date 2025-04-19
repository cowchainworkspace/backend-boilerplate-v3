import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';

import { Logger as WinstonLogger } from 'winston';

import {
  ILoggerMetadata,
  LOGGER_CONTEXT_TOKEN,
  LogLevel,
  WINSTON_LOGGER_TOKEN,
} from './logger.constants';

@Injectable()
export class Logger implements LoggerService {
  constructor(
    @Inject(WINSTON_LOGGER_TOKEN)
    private readonly _logger: WinstonLogger,
    @Optional()
    @Inject(LOGGER_CONTEXT_TOKEN)
    private _context?: string,
  ) {}

  setContext(context: string): void {
    this._context = context;
  }

  debug(message: string, metadata: ILoggerMetadata = {}): void {
    this._logWithLevel(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata: ILoggerMetadata = {}): void {
    this._logWithLevel(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata: ILoggerMetadata = {}): void {
    this._logWithLevel(LogLevel.WARN, message, metadata);
  }

  error(message: string, trace?: string, metadata: ILoggerMetadata = {}): void {
    const errorMetadata = { ...metadata };
    if (trace) {
      errorMetadata.trace = trace;
    }
    this._logWithLevel(LogLevel.ERROR, message, errorMetadata);
  }

  critical(message: string, metadata: ILoggerMetadata = {}): void {
    this._logWithLevel(LogLevel.CRITICAL, message, metadata);
  }

  log(level: LogLevel | string, message: string, metadata: ILoggerMetadata = {}): void {
    let effectiveLevel = level;

    if (!Object.values(LogLevel).includes(level as LogLevel)) {
      effectiveLevel = LogLevel.INFO;
    }

    const formattedMessage = this._formatMessage(message);
    const logMetadata = this._buildMetadata(metadata);

    this._logger.log(effectiveLevel, formattedMessage, logMetadata);
  }

  private _logWithLevel(level: LogLevel, message: string, metadata: ILoggerMetadata = {}): void {
    this.log(level, message, metadata);
  }

  private _formatMessage(message: any): string {
    if (message === undefined || message === null) {
      return '';
    }
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch (e) {
        return `[Object]: ${message.toString()}`;
      }
    }
    return String(message);
  }

  private _buildMetadata(metadata: ILoggerMetadata = {}): ILoggerMetadata {
    const baseMetadata: ILoggerMetadata = {
      service: process.env.APP_NAME || 'Cars Example',
      env: process.env.ENVIRONMENT || 'DEVELOPMENT',
      version: process.env.npm_package_version || '0.0.1',
      ...metadata,
    };

    if (this._context) {
      baseMetadata.context = this._context;
    }

    this._redactSensitiveData(baseMetadata);

    return baseMetadata;
  }

  private _redactSensitiveData(metadata: ILoggerMetadata): void {
    const sensitiveFields = [
      'password',
      'token',
      'authorization',
      'apiKey',
      'secret',
      'credentials',
    ];

    Object.keys(metadata).forEach(key => {
      const lowerCaseKey = key.toLowerCase();

      if (sensitiveFields.some(field => lowerCaseKey.includes(field))) {
        metadata[key] = '[REDACTED]';
      } else if (typeof metadata[key] === 'object' && metadata[key] !== null) {
        this._redactSensitiveData(metadata[key]);
      }
    });
  }
}
