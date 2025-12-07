import { Provider } from '@nestjs/common';

import { AppConfig } from '@apps/api/modules/configuration/app';
import { AppEnvironment } from '@shared/types';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { WINSTON_LOGGER_TOKEN } from './logger.constants';

export const loggerProvider: Provider = {
  provide: WINSTON_LOGGER_TOKEN,
  useFactory: (appConfig: AppConfig) => {
    const logDir = path.join(process.cwd(), 'logs');
    const { combine, timestamp, json, colorize, printf } = winston.format;

    const isProduction = appConfig.mode === AppEnvironment.PRODUCTION;
    const logLevel = isProduction ? 'info' : 'debug';
    const shouldUseNewLines = false;

    const consoleFormat = combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(({ level, message, timestamp, context, ...metadata }) => {
        let result = `[${timestamp}] `;

        if (context) {
          result += `[${context}] `;
        }

        result += `${level}: ${message}`;

        if (typeof metadata === 'string') {
          result += ` ${metadata}`;
        } else if (Object.keys(metadata).length > 0 && metadata.service) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { service, _, version, ...rest } = metadata;
          if (Object.keys(rest).length > 0) {
            if (shouldUseNewLines) {
              result += `\n${JSON.stringify(rest, null, 2)}`;
            } else {
              result += ` ${JSON.stringify(rest)}`;
            }
          }
        }

        return result;
      }),
    );

    const fileFormat = combine(timestamp(), json());

    const errorFileTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    });

    const combinedFileTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    });

    const consoleTransport = new winston.transports.Console({
      level: logLevel,
      format: consoleFormat,
    });

    const transports: winston.transport[] = [consoleTransport];

    if (isProduction) {
      transports.push(errorFileTransport, combinedFileTransport);
    } else {
      try {
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Could not create log directory: ${logDir}`);
      }
    }

    const customLevels = {
      levels: {
        error: 0,
        critical: 1,
        warn: 2,
        info: 3,
        verbose: 4,
        debug: 5,
      },
      colors: {
        error: 'red',
        critical: 'magenta',
        warn: 'yellow',
        info: 'green',
        verbose: 'cyan',
        debug: 'blue',
      },
    };

    winston.addColors(customLevels.colors);

    return winston.createLogger({
      levels: customLevels.levels,
      level: logLevel,
      defaultMeta: {
        service: appConfig.appName,
        env: appConfig.mode,
        version: process.env.npm_package_version || '0.0.1',
      },
      transports,
      exitOnError: false,
    });
  },
  inject: [AppConfig],
};
