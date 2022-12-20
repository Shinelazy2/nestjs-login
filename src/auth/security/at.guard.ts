import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(
      '🚀 ~ file: at.guard.ts:15 ~ AtGuard ~ classAtGuardextendsAuthGuard ~ context',
      context,
    );
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(
      '🚀 ~ file: at.guard.ts ~ line 13 ~ AtGuard ~ canActivate ~ isPublic',
      isPublic,
    );

    if (isPublic) return true;
    return super.canActivate(context);
  }
}
