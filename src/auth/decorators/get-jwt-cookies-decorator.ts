import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtCookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.cookies.jwt.access_token : 'non-cookie.. request.cookies';
});
