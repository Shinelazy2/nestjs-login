import { RoleType } from './../role-type';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateDTO {
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;
}
