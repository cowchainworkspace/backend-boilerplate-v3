import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { CORRELATION_ID_HEADER } from './logger.constants';
import { Logger } from './logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly _logger: Logger) {
    this._logger.setContext('HTTP');
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const requestId = (req.headers[CORRELATION_ID_HEADER.toLowerCase()] as string) || uuidv4();

    req.headers[CORRELATION_ID_HEADER.toLowerCase()] = requestId;
    res.setHeader(CORRELATION_ID_HEADER, requestId);

    const redactedHeaders = this._redactSensitiveHeaders(req.headers);

    this._logger.info(`Request ${req.method} ${req.originalUrl}`, {
      correlationId: requestId,
      request: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        body: this._shouldLogBody(req) ? req.body : '[BODY TOO LARGE OR BINARY]',
        headers: redactedHeaders,
        ip: req.ip,
      },
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      const logMethod = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      const logMetadata = {
        correlationId: requestId,
        response: {
          statusCode,
          duration: `${duration}ms`,
          headers: this._redactSensitiveHeaders(this._getResponseHeaders(res)),
        },
      };

      const responseMessage = `Response ${statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`;

      if (logMethod === 'error') {
        this._logger.error(responseMessage, undefined, logMetadata);
      } else if (logMethod === 'warn') {
        this._logger.warn(responseMessage, logMetadata);
      } else {
        this._logger.info(responseMessage, logMetadata);
      }

      if (statusCode >= 400) {
        const errorMessage = `Error response [${statusCode}] for ${req.method} ${req.originalUrl}`;
        const errorMetadata = {
          ...logMetadata,
          message: res.statusMessage,
        };

        if (statusCode >= 500) {
          this._logger.error(errorMessage, undefined, errorMetadata);
        } else {
          this._logger.warn(errorMessage, errorMetadata);
        }
      }

      if (duration > 1000) {
        this._logger.warn(
          `High latency response [${duration}ms] for ${req.method} ${req.originalUrl}`,
          {
            correlationId: requestId,
            duration: `${duration}ms`,
          },
        );
      }
    });

    next();
  }

  private _redactSensitiveHeaders(headers: Record<string, any>): Record<string, any> {
    const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie', 'x-api-key', 'api-key'];

    const redacted = { ...headers };

    for (const key of Object.keys(redacted)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        redacted[key] = '[REDACTED]';
      }
    }

    return redacted;
  }

  private _getResponseHeaders(res: Response): Record<string, any> {
    const headers: Record<string, any> = {};
    const rawHeaders = res.getHeaders();

    for (const key of Object.keys(rawHeaders)) {
      headers[key] = rawHeaders[key];
    }

    return headers;
  }

  private _shouldLogBody(req: Request): boolean {
    const contentType = req.headers['content-type'] || '';
    const contentLength = parseInt((req.headers['content-length'] as string) || '0', 10);

    if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/octet-stream')
    ) {
      return false;
    }

    if (contentLength > 10 * 1024) {
      return false;
    }

    return true;
  }
}
