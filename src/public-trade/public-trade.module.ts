import { CacheModule, Module } from '@nestjs/common'
import { OrderUserService } from '../manage-order/manage-order.service'
import { UserService } from 'src/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Orders } from '../manage-order/manage-orders.entity'
import { Transaction } from './transaction-orders.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { User } from 'src/user/user.entity'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { Ajax } from 'src/utils/ajax'
import { BotBinanceTradeService } from './bot-binance-trade.service'
import { PublicTradeController } from './public-trade.controller'
import { BotsAdmin } from 'src/manage-bot-admin/entitys/manage-bots-admin.entity'
import { BotAdminService } from 'src/manage-bot-admin/manage-bot-admin.service'
import { BotsUserMapping } from 'src/manage-bot-admin/entitys/use-bots-user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, BotsAdmin, Transaction, BotsUserMapping, User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(env.SECRET_KEY_BOT),
        signOptions: { expiresIn: '50000h' },
      }),
    }),
    CacheModule.register(),
  ],
  providers: [
    UserService,
    OrderUserService,
    BotAdminService,
    ConfigService,
    BinanceCoinService,
    Ajax,
    BotBinanceTradeService,
  ],
  controllers: [PublicTradeController],
})
export class PublicTradeModule {}
