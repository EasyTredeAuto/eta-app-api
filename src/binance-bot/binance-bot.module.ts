import { Module } from '@nestjs/common';
import { BinanceBotService } from './binance-bot.service';
import { BinanceBotController } from './binance-bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './bot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot])
],
  providers: [BinanceBotService],
  controllers: [BinanceBotController]
})
export class BinanceBotModule {}
