import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../types/jwtPayloadWithRt.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request?.cookies?.jwt.refresh_token;
    // console.log('🚀 ~ file: get-current-user.decorator.ts:7 ~ request', request);
    if (!refreshToken) {
      console.log('쿠키에 리프레쉬 토큰 없음 ');
      return false;
    }

    return refreshToken;
  },
);
