import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  // executionContext is a wrapper around the request object
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const session = request.session;
    return session.userId;
  }
}
