import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BotUserService } from 'src/bot-user/bot-user.service'
import { MyBot } from 'src/bot-user/mybot.entity'
import { Transaction } from 'src/public-trade/transaction-mybot.entity'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, MyBot])],
  controllers: [TransactionController],
  providers: [TransactionService, BotUserService],
})
export class TransactionModule {}
