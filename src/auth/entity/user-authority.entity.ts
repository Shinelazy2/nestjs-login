import { RoleType } from './../role-type';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_authority')
export class UserAuthority {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('string', {
    name: 'user_join_id',
  })
  joinUserId: string;

  @Column('varchar', {
    name: 'authority_name',
    default: RoleType.USER,
  })
  authorityName: RoleType;

  @ManyToOne((type) => User, (user) => user.authorities)
  @JoinColumn({
    name: 'user_join_id',
  })
  user: User;
}
