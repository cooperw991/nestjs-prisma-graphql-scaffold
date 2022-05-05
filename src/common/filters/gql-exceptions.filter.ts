import {
  HttpException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter
  implements GqlExceptionFilter, ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date(),
      error: exception.message || null,
    };

    if (request) {
      // for rest api
      const error = {
        ...errorResponse,
        path: request.url,
        method: request.method,
      };

      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(error),
        'ExceptionFilter',
      );

      response.status(status).json(errorResponse);
    } else {
      // for gql api
      const error = {
        ...errorResponse,
        type: info.parentType,
        field: info.fieldName,
      };

      return new GraphQLError(error.error, {
        extensions: { errorFields: error },
      });
    }
  }
}
