import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from '../types/payload.interface';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService, private configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log('request?.cookies : ', request?.cookies);
          return request?.cookies.jwt.access_token;
        },
      ]),
      // ignoreExpiration: true,
      secretOrKey: configService.get<string>('AT_SECRET'),
    });
  }
  /**
   *  1. token이 유효한지 확인 유효하면 validate 한다.
   *  2. 유효하지 않으면 401 Exception
   *  3. 유효하면 user 반환
   * @param payload
   * @param done
   * @returns done()
   */
  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    // console.log(
    //   '🚀 ~ file: at.jwt.strategy.ts:25 ~ AtStrategy ~ validate ~ payload',
    //   payload,
    // );
    const user = await this.authService.tokenValidateUser(payload);
    // console.log(
    //   '🚀 ~ file: passport.jwt.strategy.ts:19 ~ JwtStrategy ~ validate ~ user',
    //   user,
    // );
    if (!user) {
      return done(
        new UnauthorizedException({
          message: 'user doew not exist',
        }),
        false,
      );
    }
    return done(null, user);
  }
}
