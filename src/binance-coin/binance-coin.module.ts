import { Module } from '@nestjs/common';
import { Ajax } from 'src/utils/ajax';
import { BinanceCoinController } from './binance-coin.controller';
import { BinanceCoinService } from './binance-coin.service';

@Module({
  controllers: [BinanceCoinController],
  providers: [BinanceCoinService, Ajax]
})
export class BinanceCoinModule {}
