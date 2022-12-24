import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../role-type';

/**
 * Runtime시에 SetMetadata
 * @param roles
 * @returns
 */
export const Roles = (...roles: RoleType[]): any => {
  console.log('🚀 ~ file: role.decorator.ts:10 ~ Roles ~ ...roles', ...roles);
  return SetMetadata('roles', roles);
};
