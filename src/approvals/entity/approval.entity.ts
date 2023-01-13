import { Vacation } from 'src/vacation/entity/vacation.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsApprovalSign } from './isApprovalSign.entity';
// import { UserAuthority } from './user-authority.entity';

@Entity('approval')
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  repoter: string;

  @Column('simple-array')
  approver: string[];

  // TODO: ENUM
  @Column()
  approvalKinds: string;

  @Column('string', {
    name: 'vacation_join_id',
  })
  vacationJoinId: string;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne((type) => Vacation, (vacation) => vacation.approval)
  @JoinColumn({
    name: 'vacation_join_id',
  })
  vacation?: Vacation;

  @OneToMany((type) => IsApprovalSign, (isApprovalSign) => isApprovalSign.approval)
  isApprovalSign?: IsApprovalSign[];

  // @OneToMany((type) => UserAuthority, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities: any[];
}
