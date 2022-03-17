import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BotsAdmin } from 'src/schemas/admin-bots.entity'
import { transactionBotUserMapping } from 'src/schemas/mapping-user-bots-transaction.entity'
import { Transaction } from 'src/schemas/user-url-orders-transaction.entity'
import { Orders } from 'src/schemas/user-url-orders.entity'
import { Between, Repository } from 'typeorm'
import { transactionQueryReq } from './dtos/transaction.query.dto'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(transactionBotUserMapping)
    private transactionBotRepository: Repository<transactionBotUserMapping>,
    @InjectRepository(BotsAdmin)
    private botsBotRepository: Repository<BotsAdmin>,
    @InjectRepository(Orders)
    private orderUrlBotRepository: Repository<Orders>,
  ) {}

  async getAll(where: any, page: number, size: number, from: Date, to: Date) {
    where.createdAt = Between(from, to)
    const taskBot = this.botsBotRepository.find()
    const taskOrder = this.orderUrlBotRepository.find()
    const [bots, orderUrls] = await Promise.all([taskBot, taskOrder]).then((result) => result)
    const [result, total] = await this.transactionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    const [Result, Total] = await this.transactionBotRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    const transactionBots = JSON.parse(JSON.stringify(Result))
    for (const transaction of transactionBots) {
      const bot = bots.find((x) => x.id === transaction.botIds)
      transaction.name = bot.name
    }
    const transactionOrderUrls = JSON.parse(JSON.stringify(result))
    for (const transaction of transactionOrderUrls) {
      const order = orderUrls.find((x) => x.id === transaction.orderIds)
      transaction.name = order.name
    }
    const data = transactionBots.concat(transactionOrderUrls)
    return { data: data, count: total + Total }
  }
}
