import { ConfigService } from '@nestjs/config'
import { AppRoles } from 'src/app.roles'
import { ApiSetting } from 'src/schemas/user-secret-api.entity'
import { User } from 'src/schemas/user.entity'
import env from 'src/utils/env'
import { getRepository } from 'typeorm'

export const setDefaultUser = async (config: ConfigService) => {
  const userRepository = getRepository<User>(User)
  const apiRepository = getRepository<ApiSetting>(ApiSetting)

  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('email = :email', { email: config.get(env.DEFAULT_USER_EMAIL) })
    .getOne()

  if (!defaultUser) {
    const adminUser = userRepository.create({
      email: config.get(env.DEFAULT_USER_EMAIL),
      password: config.get(env.DEFAULT_USER_PASSWORD),
      roles: AppRoles.ADMIN,
    }) as User

    const user = await userRepository.save(adminUser)

    const apiUser = apiRepository.create({
      exchange: config.get(env.DEFAULT_EXCHANGE),
      secretKey: config.get(env.DEFAULT_SECRET_KEY),
      apiKey: config.get(env.DEFAULT_API_KEY),
      user: adminUser,
    }) as ApiSetting
    await apiRepository.save(apiUser)

    return user
  }
}
