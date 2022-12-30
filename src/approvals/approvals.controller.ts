import { UseGuards } from '@nestjs/common/decorators';
import { CreateApprovalDTO } from './dtos/create-approval.dto';
import { ApprovalsService } from './approvals.service';
import { Body, Controller, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userId.decorator';
import { AtGuard } from 'src/auth/security/at.guard';

@Controller('approvals')
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  /**
   * 결재 등록
   */
  @Post('/register')
  @UseGuards(AtGuard)
  registerApproval(@Body() dto: CreateApprovalDTO, @GetCurrentUserId() userId: string) {
    console.log('🚀 ~ file: approvals.controller.ts:18 ~ ApprovalsController ~ registerApproval ~ userId', userId);
    return this.approvalsService.registerApproval(dto, userId);
  }
}
