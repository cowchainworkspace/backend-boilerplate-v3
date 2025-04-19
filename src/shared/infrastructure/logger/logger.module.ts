import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { LOGGER_CONTEXT_TOKEN } from './logger.constants';
import { loggerProvider } from './logger.provider';
import { Logger } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [
    loggerProvider,
    {
      provide: LOGGER_CONTEXT_TOKEN,
      useValue: 'Application',
    },
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
