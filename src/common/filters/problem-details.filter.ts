import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';

// https://docs.nestjs.com/exception-filters#exception-filters-1
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .header('Content-Type', 'application/problem+json')
      .json({
        type: 'about/blank',
        title: STATUS_CODES[status],
        statusCode: status,
        detail:
          exception instanceof HttpException
            ? exception.message
            : 'Unknown Error',
        instance: request.url,
      });
  }
}
