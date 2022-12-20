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

  async update(text: unknown, options: unknown) {
    return await this.userRepository.update(options, text);
  }

  /**
   *
   * @param userDTO
   * @returns
   */
  async save(userDTO: UserDTO): Promise<User | undefined | any> {
    await this.trancsFormPassword(userDTO);
    return await this.userRepository.save(userDTO);
  }

  async save2(userDTO: UserDTO): Promise<User | undefined | any> {
    return await this.userRepository.save(userDTO);
  }

  async trancsFormPassword(user: UserDTO): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);

    return Promise.resolve();
  }
}
