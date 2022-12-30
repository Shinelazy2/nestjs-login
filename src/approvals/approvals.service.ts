import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/auth/user.service';
import { VacationService } from 'src/vacation/vacation.service';
import { Repository } from 'typeorm';
import { CreateApprovalDTO } from './dtos/create-approval.dto';
import { Approval } from './entity/approval.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval) private approvalRepository: Repository<Approval>,
    private vacationService: VacationService,
  ) {}

  /**
   * 결재 등록
   * 1. 결재한 사람이 누군지 ? ( reporter ) -> Cookie -> UserId?
   * 2. 휴가 몇일 남았는지 어떻게 알지?
   * @returns
   */
  async registerApproval(dto: CreateApprovalDTO, userId: string) {
    const { approvalKinds, approver } = dto;

    const findVacation = await this.vacationService.findByFilds({
      where: {
        joinUserId: userId,
      },
    });
    console.log(
      '🚀 ~ file: approvals.service.ts:37 ~ ApprovalsService ~ registerApproval ~ findVacation',
      findVacation,
    );

    // find User, Vacation

    const approval = this.approvalRepository.create();
    approval.repoter = userId;
    approval.approver = approver;
    approval.approvalKinds = approvalKinds;
    // Vacation Id
    approval.approvalJoinId = findVacation.id;
    console.log('🚀 ~ file: approvals.service.ts:43 ~ ApprovalsService ~ registerApproval ~ approval', approval);
    // approval.vacation =

    this.approvalRepository.save(approval);
    return '';
  }
}
