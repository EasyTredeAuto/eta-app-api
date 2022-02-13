import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { RegisterDto } from './dtos';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}
    
    async register(user: RegisterDto){
        const newUser = await this.userService.register(user)
        const { id, ...rest } = newUser
        const payload = { sub: id }

        return {
            user:newUser,
            accessToken: this.jwtService.sign(payload)
        }
    }

    async validateUser(email:string, pass:string): Promise<any> {
        const user = await this.userService.findOne({ email })
        if (user && compare(pass, user.password)) {
            const { password, ...rest } = user
            return rest  
        }
        return null
    }

    login(user: User){
        const { id, ...rest } = user
        const payload = { sub: id }

        return {
            user,
            accessToken: this.jwtService.sign(payload)
        }
    }
}
