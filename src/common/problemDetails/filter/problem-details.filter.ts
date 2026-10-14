import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';

// https://docs.nestjs.com/exception-filters#exception-filters-1
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttp) {
      // Log the real error so it isn't swallowed
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response
      .status(status)
      .header('Content-Type', 'application/problem+json')
      .json({
        type: 'about:blank',
        title: STATUS_CODES[status],
        status,
        detail: isHttp ? exception.message : 'Internal server error',
        instance: request.url,
      });
  }
}
