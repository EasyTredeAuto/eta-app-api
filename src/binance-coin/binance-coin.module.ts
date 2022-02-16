import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Ajax } from 'src/utils/ajax';
import { BinanceCoinController } from './binance-coin.controller';
import { BinanceCoinService } from './binance-coin.service';
import { AjaxLocal } from 'src/utils/ajaxLocal';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [BinanceCoinController],
  providers: [BinanceCoinService, Ajax, UserService, AjaxLocal]
})
export class BinanceCoinModule {}
