import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { CORRELATION_ID_HEADER } from '@shared/infrastructure/logger/logger.constants';
import { Logger } from '@shared/infrastructure/logger/logger.service';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly _httpAdapterHost: HttpAdapterHost,
    private readonly _logger: Logger,
  ) {
    this._logger.setContext('ExceptionsFilter');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error' };

    const correlationId =
      (request.headers[CORRELATION_ID_HEADER.toLowerCase()] as string) ||
      (response.getHeader(CORRELATION_ID_HEADER) as string);

    const logMetadata = {
      correlationId,
      exception: {
        name: exception instanceof Error ? exception.name : 'Unknown',
        message: exception instanceof Error ? exception.message : String(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
      },
      request: {
        method: request.method,
        url: request.url,
        headers: this._redactSensitiveHeaders(request.headers),
        query: request.query,
        params: request.params,
        body: request.body,
      },
    };

    if (httpStatus >= 500) {
      this._logger.error(
        `Exception: ${httpStatus} - ${exception instanceof Error ? exception.message : String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
        logMetadata,
      );
    } else {
      this._logger.warn(
        `Exception: ${httpStatus} - ${exception instanceof Error ? exception.message : String(exception)}`,
        logMetadata,
      );
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      correlationId,
      ...(typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { message: exceptionResponse }),
    };

    httpAdapter.reply(response, responseBody, httpStatus);
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
}
