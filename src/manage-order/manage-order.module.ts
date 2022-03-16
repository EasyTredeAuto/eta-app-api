import { CacheModule, Module } from '@nestjs/common'
import { OrderUserService } from './manage-order.service'
import { OrderUserController } from './manage-order.controller'
import { UserService } from 'src/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Orders } from '../schemas/user-url-orders.entity'
import { Transaction } from '../schemas/user-url-orders-transaction.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { User } from 'src/schemas/user.entity'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { Ajax } from 'src/utils/ajax'
import { BotBinanceTradeService } from '../public-trade/bot-binance-trade.service'
import { BotsAdmin } from 'src/schemas/admin-bots.entity'
import { BotsUserMapping } from 'src/schemas/mapping-user-bots.entity'
import { transactionBotUserMapping } from 'src/schemas/mapping-user-bots-transaction.entity'
import { ApiSetting } from 'src/schemas/user-secret-api.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      BotsAdmin,
      Transaction,
      User,
      BotsUserMapping,
      transactionBotUserMapping,
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
    UserService,
    OrderUserService,
    ConfigService,
    BinanceCoinService,
    Ajax,
    BotBinanceTradeService,
  ],
  controllers: [OrderUserController],
})
export class OrderUserModule {}
