import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import env from "src/utils/env";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private userService: UserService,
        private config: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get(env.JWT_SECRET_KEY)
        })
    }

    async validate(payload:any) {
        const { sub: id } = payload

        return await this.userService.getOne(id)
    }
}