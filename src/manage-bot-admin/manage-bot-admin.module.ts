import { CacheModule, Module } from '@nestjs/common'
import { BotAdminService } from './manage-bot-admin.service'
import { ManageBotAdminController } from './manage-bot-admin.controller'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BotsAdmin } from './manage-bots-admin.entity'
import { User } from 'src/user/user.entity'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([BotsAdmin, User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(env.JWT_SECRET_KEY),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    CacheModule.register(),
  ],
  providers: [BotAdminService, BotBinanceTradeService],
  controllers: [ManageBotAdminController],
})
export class ManageBotAdminModule {}
