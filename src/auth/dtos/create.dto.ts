import { RoleType } from './../role-type';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsString()
  userName: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;
}
