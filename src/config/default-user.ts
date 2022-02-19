import { ConfigService } from "@nestjs/config";
import { AppRoles } from "src/app.roles";
import { User } from "src/user/user.entity";
import env from "src/utils/env";
import { getRepository } from "typeorm";

export const setDefaultUser = async (config: ConfigService) => {
    const userRepository = getRepository<User>(User)

    const defaultUser = await userRepository
        .createQueryBuilder()
        .where('email = :email', {email: config.get(env.DEFAULT_USER_EMAIL)})
        .getOne()

    if (!defaultUser) {
        const adminUser = userRepository.create({
            email: config.get(env.DEFAULT_USER_EMAIL),
            password: config.get(env.DEFAULT_USER_PASSWORD),
            binance_api: config.get(env.DEFAULT_API_KEY),
            binance_secret_api: config.get(env.DEFAULT_SECRET_KEY),
            roles: AppRoles.ADMIN
        }) as User

        return await userRepository.save(adminUser)
    }
}