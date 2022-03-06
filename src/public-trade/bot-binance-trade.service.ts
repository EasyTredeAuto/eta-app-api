import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { payloadOrderReq } from 'src/manage-order-admin/dtos/payloadOrderReq.dtos'
import {
  payloadBotReq,
  payloadBotUpdateReq,
} from 'src/manage-order/dtos/create-bot-user-dto'
import { payloadBotDe } from 'src/manage-order/dtos/decode-payload.dto'
import { ManageOrders } from 'src/manage-order/manage-orders.entity'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Transaction } from './transaction-orders.entity'

@Injectable()
export class BotBinanceTradeService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(ManageOrders)
    private mangeOrdersRepository: Repository<ManageOrders>,
    private readonly binanceService: BinanceCoinService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async roundUpdate(id: number) {
    await this.mangeOrdersRepository
      .createQueryBuilder()
      .update('manage_order')
      .set({ round: () => `round + 1` })
      .where('id = :id', { id })
      .execute()
  }

  async createOrderBuyLimit(body) {
    const { id, asset, currency, email, amount, amountType } = body
    const symbol = `${asset}${currency}`
    let isAmount
    const balance = await this.binanceService.freeBalance(email)
    const market = await this.binanceService.getListCoinPrice(symbol)
    const price = parseFloat(market.price) - 50
    if (amountType === 'amount') isAmount = amount / price
    else
      isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
    if (balance.total[currency] < isAmount * price)
      throw new BadRequestException("can't buy limit in whit balance")
    const order = await this.binanceService.createLimitBuyOrder(
      email,
      symbol,
      isAmount,
      price,
    )
    const transaction = {
      symbol,
      amount,
      quantity: order.amount,
      price: order.price,
      order: body.botId,
      side: 'buy',
      type: order.type,
      user: id,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    await this.roundUpdate(body.botId)
    return newTransaction
  }

  async createOrderSellLimit(body) {
    const { asset, currency, email, amount, amountType, id } = body
    const symbol = `${asset}${currency}`
    let isAmount
    const balance = await this.binanceService.freeBalance(email)
    const market = await this.binanceService.getListCoinPrice(symbol)
    const price = parseFloat(market.price)
    if (amountType === 'amount') isAmount = amount / price
    else
      isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
    if ((balance.total[asset] || 0) < isAmount)
      throw new BadRequestException("can't sell limit in whit balance")
    const order = await this.binanceService.createLimitSellOrder(
      email,
      symbol,
      isAmount,
      price,
    )
    const transaction = {
      symbol,
      amount,
      quantity: order.amount,
      price: order.price,
      order: body.botId,
      side: 'sell',
      type: order.type,
      user: id,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    await this.roundUpdate(body.botId)
    return newTransaction
  }

  async createOrderBuyMarket(body) {
    const { asset, currency, email, amount, amountType, id } = body
    const symbol = `${asset}${currency}`
    let isAmount
    const balance = await this.binanceService.freeBalance(email)
    const market = await this.binanceService.getListCoinPrice(symbol)
    const price = parseFloat(market.price)
    if (amountType === 'amount') isAmount = amount / price
    else
      isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
    if ((balance.total[asset] || 0) < isAmount)
      throw new BadRequestException("can't buy market in whit balance")
    const order = await this.binanceService.createMarketOrder(
      email,
      symbol,
      'BUY',
      isAmount,
    )
    const transaction = {
      symbol,
      amount,
      quantity: order.amount,
      price: order.price,
      order: body.botId,
      side: 'buy',
      type: order.type,
      user: id,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    await this.roundUpdate(body.botId)
    return newTransaction
  }

  async createOrderSellMarket(body) {
    const { asset, currency, email, amount, amountType, id } = body
    const symbol = `${asset}${currency}`
    let isAmount
    const balance = await this.binanceService.freeBalance(email)
    const market = await this.binanceService.getListCoinPrice(symbol)
    const price = parseFloat(market.price)
    if (amountType === 'amount') isAmount = amount / price
    else
      isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
    if ((balance.total[asset] || 0) < isAmount)
      throw new BadRequestException("can't sell market in whit balance")
    const order = await this.binanceService.createMarketOrder(
      email,
      symbol,
      'SELL',
      isAmount,
    )
    const transaction = {
      symbol,
      amount,
      quantity: order.amount,
      price: order.price,
      order: body.botId,
      side: 'sell',
      type: order.type,
      user: id,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    await this.roundUpdate(body.botId)
    return newTransaction
  }

  async createBotToken(id: number, body: payloadBotReq) {
    const user = await this.userService.findOne({ id })
    const bot = {
      name: body.name,
      symbol: body.asset + body.currency,
      amount: body.amount,
      amountType: body.amountType,
      side: body.side,
      type: body.type,
      user: user,
      asset: body.asset,
      currency: body.currency,
    } as ManageOrders
    if (!bot.user)
      throw new NotFoundException("can't build token, is query failed")
    const data = await this.mangeOrdersRepository.create(bot)
    const newBot = await this.mangeOrdersRepository.save(data)
    delete newBot.createdAt
    delete newBot.deletedAt
    delete newBot.updatedAt
    const payload = await Object.assign(
      { id: user.id, email: user.email, botId: newBot.id },
      body,
    )
    const token = this.jwtService.sign(payload)
    const url = `http://localhost:80/public-trade/order?token=${token}`
    await this.mangeOrdersRepository.update({ id: newBot.id }, { url })
    return url
  }

  async updateBotToken(id: number, body: payloadBotUpdateReq) {
    const user = await this.userService.findOne({ id })
    if (!user.id)
      throw new NotFoundException("can't build token, is query failed")
    const payload = await Object.assign(
      { id: user.id, email: user.email, botId: body.id },
      body,
    )
    const token = this.jwtService.sign(payload)
    const url = `http://localhost:80/public-trade/order?token=${token}`
    const bot = {
      name: body.name,
      symbol: body.asset + body.currency,
      amount: body.amount,
      amountType: body.amountType,
      side: body.side,
      type: body.type,
      user: user,
      asset: body.asset,
      currency: body.currency,
      url,
    } as ManageOrders
    await this.mangeOrdersRepository.update({ id: body.id }, bot)
    const thisBot = await this.mangeOrdersRepository.findOne({ id: body.id })
    delete thisBot.createdAt
    delete thisBot.deletedAt
    delete thisBot.updatedAt
    return url
  }

  async decodeBotToken(token: string) {
    const result = this.jwtService.decode(token) as payloadBotDe
    const data = await this.mangeOrdersRepository.findOne({ id: result.botId })
    if (!data || !data.active)
      throw new BadRequestException('bot does not active')
    return result
  }

  // admin only ===============================================================================

  async createAdminOrder(userId: number, body: payloadOrderReq) {
    
  }
}
