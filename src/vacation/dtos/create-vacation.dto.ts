import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVacationDTO {
  @IsNumber()
  @IsNotEmpty()
  vcationDay: number;

  @IsString()
  @IsNotEmpty()
  userJoinId: string;
}
