import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  password: string;
}
