import { CacheModule, Module } from '@nestjs/common'
import { BotAdminService } from './manage-bot-admin.service'
import { ManageBotAdminController } from './manage-bot-admin.controller'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BotsAdmin } from './entitys/manage-bots-admin.entity'
import { User } from 'src/user/user.entity'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { Transaction } from 'src/public-trade/transaction-orders.entity'
import { Orders } from 'src/manage-order/manage-orders.entity'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { UserService } from 'src/user/user.service'
import { Ajax } from 'src/utils/ajax'
import { BotsUserMapping } from './entitys/use-bots-user.entity'
import { transactionBotUserMapping } from './entitys/transaction-mapping.entity'
import { UseBotByUserController } from './use-bot-user.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BotsAdmin,
      Transaction,
      BotsUserMapping,
      transactionBotUserMapping,
      Orders,
      User,
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
