import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request['user'].role;

    if (userRole === 'ADMIN') {
      return true;
    }

    throw new UnauthorizedException('Access Denied. User is not an admin.');
  }
}
