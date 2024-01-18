import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleGuard extends AuthGuard implements CanActivate {
  private allowedRoles: string[];

  constructor(allowedRoles: string[]) {
    super(new JwtService(), new ConfigService());
    this.allowedRoles = allowedRoles;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request['user'].role;

    if (this.allowedRoles.includes(userRole)) {
      return true;
    }

    throw new UnauthorizedException('Access Denied');
  }
}
