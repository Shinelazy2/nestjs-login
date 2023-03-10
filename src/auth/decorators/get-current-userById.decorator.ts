import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../types/payload.interface';

export const GetCurrentUserById = createParamDecorator((_: undefined, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest();
  console.log('🚀 ~ file: get-current-userId.decorator.ts:6 ~ GetCurrentUserId ~ request', request);
  const user = request.user as Payload;
  console.log('user : ', user);
  return user.id;
});
