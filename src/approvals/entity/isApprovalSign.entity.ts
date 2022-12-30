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
import { Approval } from './approval.entity';
// import { UserAuthority } from './user-authority.entity';

@Entity('is_approval_sign')
export class IsApprovalSign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('string', {
    name: 'approval_join_id',
  })
  approvalJoinId: string;

  @CreateDateColumn()
  regDt: Date;

  @Column({ nullable: true })
  signImage: string;

  @UpdateDateColumn()
  signDate: Date;

  @ManyToOne((type) => Approval, (approval) => approval.isApprovalSign)
  @JoinColumn({
    name: 'approval_join_id',
  })
  approval?: Approval;

  // @OneToMany((type) => UserAuthority, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities: any[];
}
