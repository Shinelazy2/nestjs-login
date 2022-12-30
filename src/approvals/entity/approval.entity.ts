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
// import { UserAuthority } from './user-authority.entity';

@Entity('approval')
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  repoter: string;

  @Column()
  approver: string;

  // TODO: ENUM
  @Column()
  approvalKinds: string;

  @Column('string', {
    name: 'approval_join_id',
  })
  approvalJoinId: string;

  @CreateDateColumn()
  repoteDate: Date;

  @Column({ nullable: true })
  signImage: string;

  @UpdateDateColumn()
  signDate: Date;

  @ManyToOne((type) => Vacation, (vacation) => vacation.approval)
  @JoinColumn({
    name: 'approval_join_id',
  })
  vacation?: Vacation;

  // @OneToMany((type) => UserAuthority, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities: any[];
}
