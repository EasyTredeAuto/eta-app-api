import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderUserService } from 'src/manage-order/manage-order.service'
import { Orders } from 'src/schemas/user-url-orders.entity'
import { Transaction } from 'src/schemas/user-url-orders-transaction.entity'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { transactionBotUserMapping } from 'src/schemas/mapping-user-bots-transaction.entity'
import { BotsAdmin } from 'src/schemas/admin-bots.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Orders,
      transactionBotUserMapping,
      BotsAdmin,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, OrderUserService],
})
export class TransactionModule {}
