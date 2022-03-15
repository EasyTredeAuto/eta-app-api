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
import { OrderUserModule } from './manage-order/manage-order.module'
import { PublicTradeModule } from './public-trade/public-trade.module'
import { UserModule } from './user/user.module'
import { APP_GUARD } from '@nestjs/core'
import { TransactionModule } from './transaction/transaction.module'
import { BotAdminModule } from './manage-bot-admin/manage-bot-admin.module'
import { SettingApiModule } from './setting-api/setting-api.module'

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
    OrderUserModule,
    BotAdminModule,
    PublicTradeModule,
    TransactionModule,
    SettingApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
