import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserType } from '../../account/user/enum/user-type.enum.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    return user?.role === UserType.ADMIN;
  }
}
