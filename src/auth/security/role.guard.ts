import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entity/user.entity';

/**
 * reflector : 런타임시에 구현체를 가져올 수 있음
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('🚀 ~ file: role.guard.ts:17 ~ RolesGuard ~ roles', roles);

    if (!roles) {
      return true;
    }

    /**
     * 흐름 Atguard strategy return user
     */
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    console.log('🚀 ~ file: role.guard.ts:27 ~ RolesGuard ~ user', user);

    /**
     * roles.includes > 권한 체크
     */
    return user && user.authorities && user.authorities.some((role) => roles.includes(role));
  }
}
