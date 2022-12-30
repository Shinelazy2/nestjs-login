import { Vacation } from 'src/vacation/entity/vacation.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAuthority } from './user-authority.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userName: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  hashedRt: string;

  /**
   * eager - 조회시 같이 딸려온다.
   */
  @OneToMany((type) => UserAuthority, (userAuthority) => userAuthority.user, {
    eager: true,
  })
  authorities: any[];

  @OneToOne((type) => Vacation, (vacation) => vacation.user, {
    eager: true,
  })
  vacation: Vacation;
}
