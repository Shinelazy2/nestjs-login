import { Vacation } from 'src/vacation/entity/vacation.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserService } from 'src/auth/user.service';
import { VacationService } from 'src/vacation/vacation.service';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { Approval } from './entity/approval.entity';
import { IsApprovalSign } from './entity/isApprovalSign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Approval, Vacation, IsApprovalSign])],
  controllers: [ApprovalsController],
  providers: [ApprovalsService, VacationService],
})
export class ApprovalsModule {}
