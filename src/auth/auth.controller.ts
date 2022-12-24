import { CreateDTO } from './dtos/create.dto';
import { RolesGuard } from './security/role.guard';
import { AuthService } from './auth.service';
import { Get, Body, Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDTO } from './dtos/user.dto';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { AtGuard } from './security/at.guard';
import { Public } from './decorators/public.decorator';
import { RtGuard } from './security/rt.guard';
import { GetCurrentUserId } from './decorators/get-current-userId.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Roles } from './decorators/role.decorator';
import { RoleType } from './role-type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async registerAccount(@Req() req: Request, @Body() createDTO: CreateDTO): Promise<any> {
    return await this.authService.registerUser(createDTO);
  }

  @Post('/login')
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validationUser(userDTO);
    res.setHeader('Autorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @UseGuards(AtGuard)
  isAuthenticated(@Req() req: Request): any {
    console.log('🚀 ~ file: auth.controller.ts:43 ~ AuthController ~ isAuthenticated ~ req', req);
    const user: any = req.user;
    console.log('🚀 ~ file: auth.controller.ts:44 ~ AuthController ~ isAuthenticated ~ user', user);
    return user;
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetCurrentUserId() userId: string, @GetCurrentUser('refreshToken') refreshToken: string) {
    console.log('🚀 ~ file: auth.controller.ts:63 ~ AuthController ~ userId', userId);
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('/admin-role')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRoleCheck(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
