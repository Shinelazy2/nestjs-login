import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dtos/user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByFilds(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }

  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    await this.trancsFormPassword(userDTO);
    console.log('userDTO : ', userDTO);
    return await this.userRepository.save(userDTO);
  }

  async trancsFormPassword(user: UserDTO): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);

    return Promise.resolve();
  }
}
