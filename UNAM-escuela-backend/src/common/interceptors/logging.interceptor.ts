import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Solo aplicar logging a GraphQL
    if (context.getType<string>() !== 'graphql') {
      return next.handle();
    }

    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const request = gqlContext.getContext().req;

    const operationType = info.operation.operation;
    const operationName = info.fieldName;
    const clientIp = request.ip || request.connection.remoteAddress;
    const userAgent = request.get('User-Agent') || 'Unknown';
    const timestamp = new Date().toISOString();

    // Log de inicio de operación
    this.logger.log(
      `[${timestamp}] ${operationType.toUpperCase()} ${operationName} - IP: ${clientIp} - User-Agent: ${userAgent}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `[${timestamp}] ${operationType.toUpperCase()} ${operationName} - SUCCESS - Duration: ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        this.logger.error(
          `[${timestamp}] ${operationType.toUpperCase()} ${operationName} - ERROR - Duration: ${duration}ms - Message: ${error.message}`,
          error.stack,
        );
        return throwError(() => error);
      }),
    );
  }
}
