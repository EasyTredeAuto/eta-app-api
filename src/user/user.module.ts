import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { User } from '../schemas/user.entity'
import { UserService } from './user.service'
import { ApiSetting } from 'src/schemas/user-secret-api.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiSetting])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
