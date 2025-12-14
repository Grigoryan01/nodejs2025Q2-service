import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, query, body } = request;
    const startTime = Date.now();

    // Log incoming request
    const requestLog = {
      method,
      url,
      query: Object.keys(query).length > 0 ? query : undefined,
      body: this.sanitizeBody(body),
    };

    this.loggingService.log(
      `Incoming request: ${method} ${url}${requestLog.query ? ` Query: ${JSON.stringify(requestLog.query)}` : ''}${requestLog.body ? ` Body: ${JSON.stringify(requestLog.body)}` : ''}`,
      'LoggingInterceptor',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.loggingService.log(
            `Response: ${method} ${url} - ${statusCode} - ${duration}ms`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode || 500;
          this.loggingService.error(
            `Response error: ${method} ${url} - ${statusCode} - ${duration}ms - ${error.message}`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;
    const sanitized = { ...body };
    // Remove password from logs
    if (sanitized.password) {
      sanitized.password = '***';
    }
    if (sanitized.oldPassword) {
      sanitized.oldPassword = '***';
    }
    if (sanitized.newPassword) {
      sanitized.newPassword = '***';
    }
    return sanitized;
  }
}
