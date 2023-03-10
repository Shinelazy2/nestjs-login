import { UserAuthority } from './entity/user-authority.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist';
import { AtStrategy } from './security/at.jwt.strategy';
import { RtStrategy } from './security/rt.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuthority]),
    JwtModule.register({
      secret: 'secret_key',
      signOptions: {
        expiresIn: '300s',
      },
    }),
    PassportModule,
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, AtStrategy, RtStrategy],
})
export class AuthModule {}
