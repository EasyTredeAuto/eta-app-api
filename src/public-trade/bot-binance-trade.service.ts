import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import {
  payloadBotReq,
  payloadBotToken,
  payloadBotUpdateReq,
  payloadUpdateBotReq,
} from 'src/manage-bot-admin/dtos/create-bot-dto'
import { BotsAdmin } from 'src/manage-bot-admin/entitys/manage-bots-admin.entity'
import {
  payloadOrderReq,
  payloadOrderUpdateReq,
} from 'src/manage-order/dtos/create-bot-user-dto'
import { payloadOrderDe } from 'src/manage-order/dtos/decode-payload.dto'
import { Orders } from 'src/manage-order/manage-orders.entity'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Transaction } from './transaction-orders.entity'

@Injectable()
export class BotBinanceTradeService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Orders)
    private mangeOrdersRepository: Repository<Orders>,
    @InjectRepository(BotsAdmin)
    private mangeBotsRepository: Repository<BotsAdmin>,
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

  async createOrderToken(id: number, body: payloadOrderReq) {
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
    } as Orders
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

  async updateOrderToken(id: number, body: payloadOrderUpdateReq) {
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
    } as Orders
    await this.mangeOrdersRepository.update({ id: body.id }, bot)
    const thisBot = await this.mangeOrdersRepository.findOne({ id: body.id })
    delete thisBot.createdAt
    delete thisBot.deletedAt
    delete thisBot.updatedAt
    return url
  }

  async decodeOrderToken(token: string) {
    const result = this.jwtService.decode(token) as payloadOrderDe
    const data = await this.mangeOrdersRepository.findOne({
      id: result.orderId,
    })
    if (!data || !data.active)
      throw new BadRequestException('bot does not active')
    return result
  }

  // admin only ===============================================================================

  async createBotByAdmin(userId: number, body: payloadBotReq) {
    const user = await this.userService.findOne({ id: userId })
    const bot = {
      user: user,
      name: body.name,
      detail: body.detail,
      symbol: body.asset + body.currency,
      asset: body.asset,
      currency: body.currency,
    } as BotsAdmin
    if (!bot.user)
      throw new NotFoundException("can't build token, is query failed")
    const data = await this.mangeBotsRepository.create(bot)
    const newBot = await this.mangeBotsRepository.save(data)
    delete newBot.createdAt
    delete newBot.deletedAt
    delete newBot.updatedAt
    const payloadBuy = await Object.assign(
      { id: user.id, email: user.email, botId: newBot.id, side: 'buy' },
      body,
    )
    const payloadSell = await Object.assign(
      { id: user.id, email: user.email, botId: newBot.id, side: 'sell' },
      body,
    )
    const tokenBuy = this.jwtService.sign(payloadBuy)
    const tokenSell = this.jwtService.sign(payloadSell)
    const urlBuy = `http://localhost:80/public-trade/order/admin?token=${tokenBuy}`
    const urlSell = `http://localhost:80/public-trade/order/admin?token=${tokenSell}`
    await this.mangeBotsRepository.update(
      { id: newBot.id },
      { urlBuy, urlSell },
    )
    return { urlBuy, urlSell }
  }

  async updateBotByAdmin(userId: number, body: payloadUpdateBotReq) {
    const user = await this.userService.findOne({ id: userId })
    const isBot = await this.mangeBotsRepository.findOne({
      where: { id: body.id },
    })
    if (!isBot)
      throw new NotFoundException("can't build token, is query failed")
    const bot = {
      user: user,
      name: body.name,
      detail: body.detail,
      symbol: body.asset + body.currency,
      asset: body.asset,
      currency: body.currency,
    } as BotsAdmin
    if (!bot.user)
      throw new NotFoundException("can't build token, is query failed")
    const payloadBuy = await Object.assign(
      { id: user.id, email: user.email, botId: body.id, side: 'buy' },
      body,
    )
    const payloadSell = await Object.assign(
      { id: user.id, email: user.email, botId: body.id, side: 'sell' },
      body,
    )
    const tokenBuy = this.jwtService.sign(payloadBuy)
    const tokenSell = this.jwtService.sign(payloadSell)
    const urlBuy = `http://localhost:80/public-trade/order/admin?token=${tokenBuy}`
    const urlSell = `http://localhost:80/public-trade/order/admin?token=${tokenSell}`
    const newUpdate = Object.assign(bot, { urlBuy, urlSell })
    await this.mangeBotsRepository.update({ id: body.id }, newUpdate)
    return { urlBuy, urlSell }
  }

  async decodeBotToken(token: string) {
    const result = this.jwtService.decode(token) as payloadBotToken
    console.log(result, token)
    const data = await this.mangeBotsRepository.findOne({
      where: { id: result.botId, active: true },
    })
    if (!data) throw new BadRequestException('bot does not active')
    return result
  }
}
