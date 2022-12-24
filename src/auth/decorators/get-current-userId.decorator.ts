import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../types/payload.interface';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Payload;
    console.log('user : ', user);
    return user.id;
  },
);
