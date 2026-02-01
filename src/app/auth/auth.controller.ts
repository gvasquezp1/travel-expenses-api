import {
  Controller,
  HttpCode,
  UseGuards,
  HttpStatus,
  Request,
  Get,
  Post,
  Body,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user?.locked) {
      throw new ForbiddenException('Usuario bloqueado');
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async profile(@Request() req) {
    return req.user;
  }

  // @UseGuards(LocalAuthGuard)
  // @Get('profile')
  // @HttpCode(HttpStatus.OK)
  // async logout(@Request() req)
  // {
  //     return req.user;
  // }
}
