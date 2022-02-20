import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from 'src/public-trade/transaction-mybot.entity'
import { Repository } from 'typeorm'
import { transactionQueryReq } from './dtos/transaction.query.dto'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getAll(where: transactionQueryReq, page: number, size: number) {
    if (where.name) delete where.name
    const [result, total] = await this.transactionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result, count: total }
  }
}
