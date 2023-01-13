import { Approval } from 'src/approvals/entity/approval.entity';
import { User } from 'src/auth/entity/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { UserAuthority } from './user-authority.entity';

@Entity('vacation')
export class Vacation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vcationDay: number;

  @CreateDateColumn()
  created_at: Date;

  @Column('string', {
    name: 'user_join_id',
  })
  userJoinId: string;

  @OneToMany((type) => Approval, (approval) => approval.vacation)
  approval?: Approval[];

  @OneToOne((type) => User, (user) => user.vacation)
  @JoinColumn({
    name: 'user_join_id',
  })
  user!: User;
}
