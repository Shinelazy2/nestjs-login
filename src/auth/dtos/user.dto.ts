import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  id: string;

  @IsNotEmpty()
  loginId: string;

  @IsNotEmpty()
  password: string;
}
