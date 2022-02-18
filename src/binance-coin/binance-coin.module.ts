import { CacheModule, CACHE_MANAGER, Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Ajax } from 'src/utils/ajax';
import { BinanceCoinController } from './binance-coin.controller';
import { BinanceCoinService } from './binance-coin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register()
  ],
  controllers: [BinanceCoinController],
  providers: [BinanceCoinService, Ajax, UserService]
})
export class BinanceCoinModule {}
