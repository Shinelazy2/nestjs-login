import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAuthority } from './user-authority.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  hashedRt: string;

  @OneToMany((type) => UserAuthority, (userAuthority) => userAuthority.user, {
    eager: true,
  })
  authorities: any[];
}
