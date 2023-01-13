import { IsApprovalSign } from './entity/isApprovalSign.entity';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/auth/user.service';
import { VacationService } from 'src/vacation/vacation.service';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateApprovalDTO } from './dtos/create-approval.dto';
import { Approval } from './entity/approval.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval) private approvalRepository: Repository<Approval>,
    @InjectRepository(IsApprovalSign) private isApprovalSignRepository: Repository<IsApprovalSign>,
    private vacationService: VacationService,
  ) {}

  /**
   * 결재 등록
   * 1. 결재한 사람이 누군지 ? ( reporter ) -> Cookie -> UserId?
   * 2. 휴가 몇일 남았는지 어떻게 알지?
   * @returns
   */
  async registerApproval(dto: CreateApprovalDTO, userById: string) {
    const { approvalKinds, approver } = dto;
    let vacation = undefined;
    if (approvalKinds === '휴가') {
      vacation = await this.vacationService.findByFilds({
        where: {
          userJoinId: userById,
        },
      });
    }

    // TODO: 휴가가 아니면 ?

    if (!vacation) {
      throw new BadRequestException({ message: '등록된 휴가가 없습니다.' });
    }
    const approval = this.approvalRepository.create();
    approval.repoter = userById;
    approval.approver = approver;
    approval.approvalKinds = approvalKinds;
    // Vacation Id
    approval.vacationJoinId = vacation.id;
    const saveApproval = await this.approvalRepository.save(approval);

    console.log('🚀 ~ file: approvals.service.ts:43 ~ ApprovalsService ~ registerApproval ~ approval', approval);
    // approval.vacation =

    /**
     * 결재 아이디를 알아야하는데.. ?
     * 1. 저장하고 해야하나?
     */

    await Promise.all([
      saveApproval.approver.forEach(async (value) => {
        const isApprovalSign: IsApprovalSign = this.isApprovalSignRepository.create();
        isApprovalSign.approvalJoinId = saveApproval.id;
        isApprovalSign.name = value;
        console.log('🚀 ~ file: approvals.service.ts:54 ~ ApprovalsService ~ approver.forEach ~ isApprovalSign', value);
        await this.isApprovalSignRepository.save(isApprovalSign);
      }),
    ]);
    return saveApproval;
  }

  async findByFilds(options: FindOneOptions<Approval>): Promise<Approval | undefined> {
    return await this.approvalRepository.findOne(options);
  }
}
