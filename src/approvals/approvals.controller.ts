import { Approval } from 'src/approvals/entity/approval.entity';
import { Get, UseGuards } from '@nestjs/common/decorators';
import { CreateApprovalDTO } from './dtos/create-approval.dto';
import { ApprovalsService } from './approvals.service';
import { Body, Controller, Post } from '@nestjs/common';
import { GetCurrentUserById } from 'src/auth/decorators/get-current-userById.decorator';
import { AtGuard } from 'src/auth/security/at.guard';

@Controller('approvals')
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  /**
   * ๊ฒฐ์ฌ ๋ฑ๋ก
   */
  @Post('/register')
  @UseGuards(AtGuard)
  registerApproval(@Body() dto: CreateApprovalDTO, @GetCurrentUserById() userById: string) {
    console.log('๐ ~ file: approvals.controller.ts:18 ~ ApprovalsController ~ registerApproval ~ userById', userById);
    return this.approvalsService.registerApproval(dto, userById);
  }
  /**
   * TODO: ๊ฒฐ์ฌ ์น์ธ
   * 1. ๊ฒฐ์ฌ๋ฅผ ํ  ์ ์๋ ์ฌ๋์ธ์ง ๋ด์ผํ๋ค.
   * 1. ๊ฒฐ์ฌ๋ฅผ ์น์ธํ ๋, ์น์ธ๋์๋์ง ํ๋จํด์ผํ๋ค.
   * 1. isSign Entiy ๋ง๋ค์ด์ผํ๋?
   * 2. ๊ฒฐ์ฌ๋ฅผ ํด์ผํ๋์ง?
   */
  @Post('/approval-sign')
  approvalSign() {
    return '';
  }

  /**
   * ๊ฒฐ์ฌ ์กฐํ
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
