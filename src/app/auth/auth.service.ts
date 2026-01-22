import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }


    async validateUser(email: string, password: string): Promise<any> {
        console.log(email, password)
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }

        const { passwordHash: _, ...result } = user;
        return result;
    }

    async login(user: any): Promise<any> {

        const payload = { email: user.email, sub: user.id };
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }

    async validateToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            return new UnauthorizedException('Invalid token');
        }
    }
}
