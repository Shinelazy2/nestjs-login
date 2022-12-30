import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateApprovalDTO {
  @IsNotEmpty()
  approver: string[];

  @IsNotEmpty()
  approvalKinds: string;
}
