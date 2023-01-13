import { CreateUserDTO } from './dtos/create.dto';
import { RolesGuard } from './security/role.guard';
import { AuthService } from './auth.service';
import { Get, Body, Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDTO } from './dtos/user.dto';
import { HttpCode, Param, Query, UseGuards } from '@nestjs/common/decorators';
import { AtGuard } from './security/at.guard';
import { Public } from './decorators/public.decorator';
import { RtGuard } from './security/rt.guard';
import { GetCurrentUserById } from './decorators/get-current-userById.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Roles } from './decorators/role.decorator';
import { RoleType } from './role-type';
import { JwtCookies } from './decorators/get-jwt-cookies-decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async registerAccount(@Req() req: Request, @Res() res: Response, @Body() createDTO: CreateUserDTO): Promise<any> {
    const jwt = await this.authService.registerUser(createDTO);
    res.cookie('jwt', jwt, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({
      message: 'success',
    });
  }

  @Post('/login')
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validationUser(userDTO);
    // res.setHeader('Autorization', 'Bearer ' + jwt.accessToken);
    // 1 day
    res.cookie('jwt', jwt, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({
      message: 'success',
    });
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
  async refreshTokens(
    @GetCurrentUserById() userById: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    console.log('🚀 ~ file: auth.controller.ts:63 ~ AuthController ~ userById', userById);
    console.log('🚀 ~ file: auth.controller.ts:59 ~ AuthController ~ refreshToken', refreshToken);
    const jwt = await this.authService.refreshTokens(userById, refreshToken);
    console.log('🚀 ~ file: auth.controller.ts:60 ~ AuthController ~ jwt', jwt);
    res.cookie('jwt', jwt, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({
      message: 'success',
    });
  }

  @Get('/admin-role')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRoleCheck(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }

  @Get('/cookies')
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies['jwt'];
    return res.send(jwt);
  }

  @Post('/logout')
  logout(@Res() res: Response): any {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    return res.send({
      message: 'success',
    });
  }

  @Get('/cookie-test')
  getCookieTest(@JwtCookies('access_token') cookie: string) {
    console.log('cookie : ', cookie);
    return cookie;
  }

  @Get('/userList')
  async getUserList() {
    return await this.authService.userList();
  }

  /**
   * Param 과 Query의 차이는?
   * Param -> /:id
   * Query -> ?id=123
   * @param userById
   */
  @Get('/getUser/:id')
  async getUser(@Param('id') loginId: string) {
    return this.authService.getUser(loginId);
  }
}
