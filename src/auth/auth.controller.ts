import { Controller, HttpCode, UseGuards, HttpStatus, Request, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);  // Use req.user from LocalStrategy
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
