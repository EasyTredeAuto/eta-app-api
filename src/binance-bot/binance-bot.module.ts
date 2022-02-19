import { Module } from '@nestjs/common';
import { BinanceBotService } from './binance-bot.service';
import { BinanceBotController } from './binance-bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './bot.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot, User])
],
  providers: [BinanceBotService, UserService],
  controllers: [BinanceBotController]
})
export class BinanceBotModule {}
