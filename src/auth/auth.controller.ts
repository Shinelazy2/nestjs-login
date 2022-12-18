import { JwtStrategy } from './security/passport.jwt.strategy';
import { AuthService } from './auth.service';
import { Get, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDTO } from './dtos/user.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from './security/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async registerAccount(
    @Req() req: Request,
    @Body() userDTO: UserDTO,
  ): Promise<any> {
    return await this.authService.registerUser(userDTO);
  }

  @Post('/login')
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validationUser(userDTO);
    res.setHeader('Autorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @UseGuards(JwtAuthGuard)
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
