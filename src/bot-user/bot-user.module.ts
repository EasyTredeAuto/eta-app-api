import { CacheModule, Module } from '@nestjs/common'
import { BotUserService } from './bot-user.service'
import { BotUserController } from './bot-user.controller'
import { UserService } from 'src/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MyBot } from './mybot.entity'
import { Transaction } from '../public-trade/transaction-mybot.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import env from 'src/utils/env'
import { User } from 'src/user/user.entity'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { Ajax } from 'src/utils/ajax'
import { BotBinanceTradeService } from '../public-trade/bot-binance-trade.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([MyBot, Transaction, User]),
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
    BotUserService,
    ConfigService,
    BinanceCoinService,
    Ajax,
    BotBinanceTradeService,
  ],
  controllers: [BotUserController],
})
export class BotUserModule {}
