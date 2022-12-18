import { UserDTO } from './dtos/user.dto';
import { UserService } from './user.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(newUser: UserDTO): Promise<UserDTO> {
    const userFind: UserDTO = await this.userService.findByFilds({
      where: { username: newUser.username },
    });

    if (userFind) {
      throw new HttpException(
        'Username already userd!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userService.save(newUser);
  }

  async validationUser(
    userDTO: UserDTO,
  ): Promise<{ accessToken: string } | undefined> {
    const userFind: User = await this.userService.findByFilds({
      where: { username: userDTO.username },
    });
    console.log(
      '🚀 ~ file: auth.service.ts:42 ~ AuthService ~ userFind',
      userFind,
    );

    const validatePassword = await bcrypt.compare(
      userDTO.password,
      userFind.password,
    );
    if (!userFind || !validatePassword) {
      throw new UnauthorizedException();
    }
    const payload: Payload = { id: userFind.id, username: userFind.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<UserDTO | undefined> {
    return await this.userService.findByFilds({
      where: {
        id: payload.id,
      },
    });
  }
}
