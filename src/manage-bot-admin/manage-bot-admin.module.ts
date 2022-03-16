import { CacheModule, Module } from '@nestjs/common'
import { BotAdminService } from './manage-bot-admin.service'
import { ManageBotAdminController } from './manage-bot-admin.controller'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BotsAdmin } from '../schemas/admin-bots.entity'
import { User } from 'src/schemas/user.entity'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { Transaction } from 'src/schemas/user-url-orders-transaction.entity'
import { Orders } from 'src/schemas/user-url-orders.entity'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { UserService } from 'src/user/user.service'
import { Ajax } from 'src/utils/ajax'
import { BotsUserMapping } from '../schemas/mapping-user-bots.entity'
import { transactionBotUserMapping } from '../schemas/mapping-user-bots-transaction.entity'
import { UseBotByUserController } from './use-bot-user.controller'
import { ApiSetting } from 'src/schemas/user-secret-api.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BotsAdmin,
      Transaction,
      BotsUserMapping,
      transactionBotUserMapping,
      Orders,
      User,
      ApiSetting,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(env.JWT_SECRET_KEY),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    CacheModule.register(),
  ],
  providers: [
    BotAdminService,
    BotBinanceTradeService,
    BinanceCoinService,
    UserService,
    Ajax,
  ],
  controllers: [ManageBotAdminController, UseBotByUserController],
})
export class BotAdminModule {}
