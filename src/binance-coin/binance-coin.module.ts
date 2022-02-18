import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Ajax } from 'src/utils/ajax';
import { BinanceCoinController } from './binance-coin.controller';
import { BinanceCoinService } from './binance-coin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(env.JWT_SECRET_KEY),
        signOptions: { expiresIn: '24h'}
      })
    })
  ],
  controllers: [BinanceCoinController],
  providers: [BinanceCoinService, Ajax, UserService]
})
export class BinanceCoinModule {}
