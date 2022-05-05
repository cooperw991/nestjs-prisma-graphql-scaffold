import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly i18n: I18nRequestScopeService) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user): any {
    if (err || !user) {
      const errMsg = this.i18n.translate('general.UNAUTHENTICATED');
      throw new UnauthorizedException(errMsg);
    }
    return user;
  }
}
