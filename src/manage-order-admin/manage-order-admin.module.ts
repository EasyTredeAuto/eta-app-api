import { CacheModule, Module } from '@nestjs/common'
import { OrderAdminService } from './manage-order-admin.service'
import { ManageOrderAdminController } from './manage-order-admin.controller'
import { ManageOrdersAdmin } from './manage-orders-admin.entity'
import { User } from 'src/user/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { ManageOrders } from 'src/manage-order/manage-orders.entity'
import { Transaction } from 'src/public-trade/transaction-orders.entity'
import { UserService } from 'src/user/user.service'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { Ajax } from 'src/utils/ajax'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManageOrdersAdmin,
      Transaction,
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
    Ajax,
    ConfigService,
    UserService,
    OrderAdminService,
    BotBinanceTradeService,
  ],
  controllers: [ManageOrderAdminController],
})
export class ManageOrderAdminModule {}
