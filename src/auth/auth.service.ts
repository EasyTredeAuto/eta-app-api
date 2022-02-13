import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}
    
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
