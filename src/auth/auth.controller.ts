import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, User } from 'src/common/decorators';
import { User as UserEntity} from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @User() user: UserEntity
    ) {
        const data = await this.authService.login(user)
        return {
            message: 'Login success',
            data
        }
    }
    
    @Post('register')
    async register(
        @Body() user: RegisterDto,
    ) {
        const data = await this.authService.register(user)
        return {
            message: 'Register success',
            data
        }
    }
    
    @Auth()
    @Get('profile')
    profile() {
        return 'asd'
    }

    @Auth()
    @Get('refresh')
    async refreshToken(@User() user: UserEntity){
        const data = await this.authService.login(user)
        return {
            message: 'Refresh success',
            data
        }
    }
}
