import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateApprovalDTO {
  @IsString()
  @IsNotEmpty()
  approver: string;

  @IsNotEmpty()
  approvalKinds: string;
}
