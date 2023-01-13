import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from './dtos/create.dto';
import { UserDTO } from './dtos/user.dto';
import { UserService } from './user.service';
import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payload } from './types/payload.interface';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { UserAuthority } from './entity/user-authority.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from './role-type';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private dataSource: DataSource,
    private jwtService: JwtService,
    @InjectRepository(UserAuthority) private authorityRepository: Repository<UserAuthority>,
    private configService: ConfigService,
  ) {}

  /**
   *  회원가입
   *  1. userDto에서 아이디가 있는지 확인.
   *  2. user가 있으면 BadRequest,
   *  3. user가 없으면 save()
   * @param newUser userDto
   * @returns typeOrm.save()
   */
  async registerUser(newUser: CreateUserDTO): Promise<UserDTO> {
    const userFind = await this.userService.findByFilds({
      where: {
        loginId: newUser.loginId,
      },
    });
    // const test: UserAuthority = {
    //   authorityName: 'sdf',
    // };

    // console.log('🚀 ~ file: auth.service.ts:34 ~ AuthService ~ registerUser ~ userFind', userFind);

    if (userFind) {
      throw new HttpException('loginId already userd!', HttpStatus.BAD_REQUEST);
    }
    const signUser = await this.userService.save(newUser);
    // console.log('🚀 ~ file: auth.service.ts:42 ~ AuthService ~ registerUser ~ signUser', signUser);

    const test = new UserAuthority();
    test.authorityName = newUser.role;
    test.user = signUser;
    this.authorityRepository.save(test);

    const tokens = await this.getTokens(signUser.id, signUser.loginId);
    this.updateRtHash(signUser.id, tokens.refresh_token);
    // console.log(
    //   '🚀 ~ file: auth.service.ts:55 ~ AuthService ~ registerUser ~ tokens.refresh_token',
    //   tokens.refresh_token,
    // );
    return tokens;
  }

  /**
   * 1. user를 찾아서
   * 2. userDto와 찾은 password 값을 비교한다.
   * 3. 비교 후 값이 같으면 payload에 userFind.id, userFind.loginId
   * 4. {access_tokens,refresh_token}
   * @param userDTO
   * @returns { accessToknes }
   */
  async validationUser(userDTO: UserDTO): Promise<{ accessToken: string } | undefined> {
    // console.log('🚀 ~ file: auth.service.ts:55 ~ AuthService ~ userDTO', userDTO);
    const userFind: User = await this.userService.findByFilds({
      where: {
        loginId: userDTO.loginId,
      },
    });
    // console.log('🚀 ~ file: auth.service.ts:42 ~ AuthService ~ userFind', userFind);

    if (userFind === null) {
      throw new UnauthorizedException({
        message: '유저를 찾을 수 없음',
      });
    }

    const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);
    // console.log('🚀 ~ file: auth.service.ts:93 ~ AuthService ~ validatePassword', validatePassword);

    if (!userFind || !validatePassword) {
      throw new UnauthorizedException({
        messgae: '패스워드가 같지 않음',
      });
    }
    this.convertInAuthorities(userFind);
    // const payload: Payload = { id: userFind.id, loginId: userFind.loginId };
    return this.getTokens(userFind.id, userFind.loginId, userFind.authorities);
  }
  /**
   * 1. PayLoad.id 로 DB에 있는지 확인
   * @param payload
   * @returns User
   */
  async tokenValidateUser(payload: Payload): Promise<UserDTO | undefined> {
    const userFind = await this.userService.findByFilds({
      where: {
        id: payload.id,
      },
    });
    this.flatauthorities(userFind);
    return userFind;
  }

  private flatauthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach((authority) => {
        authorities.push(authority.authorityName);
      });
      user.authorities = authorities;
    }
    return user;
  }

  /**
   * 토큰발급
   * @param loginId
   * @param loginId
   * @returns { access_token, refresh_token}
   */
  async getTokens(id: string, loginId: string, authorities?: any[]): Promise<any> {
    const JwtPayload = {
      id,
      loginId,
      authorities,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(JwtPayload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(JwtPayload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  /**
   * 토크 저장
   * @param loginId
   * @param rt
   */
  async updateRtHash(loginId: string, rt: string) {
    // console.log('🚀 ~ file: auth.service.ts:140 ~ AuthService ~ updateRtHash ~ rt', rt);
    // console.log('🚀 ~ file: auth.service.ts:140 ~ AuthService ~ updateRtHash ~ loginId', loginId);
    const hash = await this.hashData(rt);
    await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set({ hashedRt: hash })
      .where('id = :id', { id: loginId })
      .execute();
  }

  /**
   * 리프레시 토큰 발급
   * @param loginId
   * @param rt
   * @returns
   */
  async refreshTokens(loginId: string, rt: string) {
    const user = await this.userService.findByFilds({
      where: {
        id: loginId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    // console.log('🚀 ~ file: auth.service.ts:182 ~ AuthService ~ refreshTokens ~ rtMatches', rtMatches);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.loginId);
    // console.log('🚀 ~ file: auth.service.ts:183 ~ AuthService ~ refreshTokens ~ tokens', tokens);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  // async makeCookie(jwt: any) {
  //   const test = 'setset','asdasd';
  //   return jwt;
  // }

  /**
   * 암호화
   * @param data
   * @returns
   */
  hashData(data: string) {
    // console.log('hashdata : ', data);
    return bcrypt.hash(data, 10);
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach((authority) => {
        authorities.push({
          name: authority.authorityName,
        });
      });

      user.authorities = authorities;
    }
    return user;
  }

  async userList() {
    return await this.userService.findByAllFilds();
  }

  async getUser(loginId: string) {
    const user = await this.userService.findByFilds({
      where: {
        loginId,
      },
    });

    if (!user) throw new ForbiddenException('조회유저없음');

    return user;
  }
}
