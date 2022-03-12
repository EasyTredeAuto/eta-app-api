import { CacheModule, Module } from '@nestjs/common'
import { OrderUserService } from './manage-order.service'
import { OrderUserController } from './manage-order.controller'
import { UserService } from 'src/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Orders } from './manage-orders.entity'
import { Transaction } from '../public-trade/transaction-orders.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { User } from 'src/user/user.entity'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { Ajax } from 'src/utils/ajax'
import { BotBinanceTradeService } from '../public-trade/bot-binance-trade.service'
import { BotsAdmin } from 'src/manage-bot-admin/manage-bots-admin.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, BotsAdmin, Transaction, User]),
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
