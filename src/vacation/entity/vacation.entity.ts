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
    name: 'join_user_id',
  })
  joinUserId: string;

  @OneToMany((type) => Approval, (approval) => approval.vacation)
  approval?: Approval[];

  @OneToOne((type) => User, (user) => user.vacation)
  @JoinColumn({
    name: 'join_user_id',
  })
  user!: User;
}
