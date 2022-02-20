import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import env from './utils/env'
import { AccessControlModule } from 'nest-access-control'
import { roles } from './app.roles'
import { BinanceCoinModule } from './binance-coin/binance-coin.module'
import { BinanceBotModule } from './binance-bot/binance-bot.module'
import { BotUserModule } from './bot-user/bot-user.module'
import { PublicTradeModule } from './public-trade/public-trade.module'
import { UserModule } from './user/user.module'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    AccessControlModule.forRoles(roles),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cs: ConfigService) => ({
        type: 'mysql',
        host: cs.get(env.MYSQL_DB_HOST),
        port: cs.get(env.MYSQL_DB_PORT),
        username: cs.get(env.MYSQL_DB_USER),
        password: cs.get(env.MYSQL_DB_PASSWORD),
        database: cs.get(env.MYSQL_DB_NAME),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    BinanceCoinModule,
    BinanceBotModule,
    BotUserModule,
    PublicTradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
