import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { CORRELATION_ID_HEADER } from './logger.constants';
import { Logger } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly _logger: Logger) {
    this._logger.setContext('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body, params, query } = req;

    const correlationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()] || uuidv4();
    req.headers[CORRELATION_ID_HEADER.toLowerCase()] = correlationId;

    const now = Date.now();
    const requestSize = req.headers['content-length']
      ? parseInt(req.headers['content-length'], 10)
      : 0;

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const responseTime = Date.now() - now;
          const responseSize = this._calculateResponseSize(data);

          this._logger.debug(`${method} ${originalUrl} completed in ${responseTime}ms`, {
            correlationId,
            requestMetrics: {
              method,
              path: originalUrl,
              responseTime,
              requestSize,
              responseSize,
            },
          });
        },
        error: (error: Error) => {
          const responseTime = Date.now() - now;

          this._logger.error(
            `Request failed for ${method} ${originalUrl} in ${responseTime}ms`,
            error.stack,
            {
              correlationId,
              error: {
                message: error.message,
                name: error.name,
              },
              request: {
                method,
                path: originalUrl,
                params,
                query,
                body,
              },
            },
          );
        },
      }),
    );
  }

  private _calculateResponseSize(data: any): number {
    if (!data) return 0;

    try {
      const jsonString = JSON.stringify(data);
      return new TextEncoder().encode(jsonString).length;
    } catch (error) {
      return 0;
    }
  }
}
