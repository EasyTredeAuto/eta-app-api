import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators';
import { User as UserEntity} from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: UserEntity) {
        const data = await this.authService.login(user)
        return {
            message: 'Login success',
            data
        }
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile() {
        return 'asd'
    }
}
