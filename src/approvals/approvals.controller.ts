import { Approval } from 'src/approvals/entity/approval.entity';
import { Get, UseGuards } from '@nestjs/common/decorators';
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
  /**
   * TODO: 결재 승인
   * 1. 결재를 할 수 있는 사람인지 봐야한다.
   * 1. 결재를 승인할때, 승인되었는지 판단해야한다.
   * 1. isSign Entiy 만들어야하나?
   * 2. 결재를 해야하는지?
   */
  @Post('/approval-sign')
  approvalSign() {
    return '';
  }

  /**
   * 결재 조회
   */
  @Get('/approval-select')
  async approvalSelect() {
    const loggings: Approval = await this.approvalsService.findByFilds({
      where: {
        id: '2e9af72b-0c37-4b9f-9b14-b23febaa5edf',
      },
    });

    return loggings;
  }
}
