import { CacheModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { env } from 'process'
import { ApiSetting } from 'src/schemas/user-secret-api.entity'
import { User } from 'src/schemas/user.entity'
import { UserService } from 'src/user/user.service'
import { Ajax } from 'src/utils/ajax'
import { BinanceCoinController } from './binance-coin.controller'
import { BinanceCoinService } from './binance-coin.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiSetting]),
    CacheModule.register(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(env.JWT_SECRET_KEY),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [BinanceCoinService, Ajax, UserService],
  controllers: [BinanceCoinController],
})
export class BinanceCoinModule {}
