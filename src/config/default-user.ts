import { ConfigService } from "@nestjs/config";
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
            roles: ["ADMIN"]
        })

        return await userRepository.save(adminUser)
    }
}