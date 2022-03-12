import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderUserService } from 'src/manage-order/manage-order.service'
import { Orders } from 'src/manage-order/manage-orders.entity'
import { Transaction } from 'src/public-trade/transaction-orders.entity'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Orders])],
  controllers: [TransactionController],
  providers: [TransactionService, OrderUserService],
})
export class TransactionModule {}
