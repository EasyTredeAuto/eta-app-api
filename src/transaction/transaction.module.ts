import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BotUserService } from 'src/manage-order/manage-order.service'
import { ManageOrders } from 'src/manage-order/manage-orders.entity'
import { Transaction } from 'src/public-trade/transaction-mybot.entity'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, ManageOrders])],
  controllers: [TransactionController],
  providers: [TransactionService, BotUserService],
})
export class TransactionModule {}
