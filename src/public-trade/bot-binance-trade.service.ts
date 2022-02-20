import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service'
import { payloadBotReq } from 'src/bot-user/dtos/create-bot-user-dto'
import { MyBot } from 'src/bot-user/mybot.entity'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Transaction } from './transaction-mybot.entity'

@Injectable()
export class BotBinanceTradeService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(MyBot)
    private myBotRepository: Repository<MyBot>,
    private readonly binanceService: BinanceCoinService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createOrderBuyLimit(body) {
    const { asset, currency, email, amount, amountType } = body
    let isAmount
    const symbol = `${asset}${currency}`
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
      bot: body.botId,
      side: 'buy',
      type: order.type,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    return newTransaction
  }

  async createOrderSellLimit(body) {
    const { asset, currency, email, amount, amountType } = body
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
      bot: body.botId,
      side: 'sell',
      type: order.type,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    return newTransaction
  }

  async createOrderBuyMarket(body) {
    const { asset, currency, email, amount, amountType } = body
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
      bot: body.botId,
      side: 'buy',
      type: order.type,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    return newTransaction
  }

  async createOrderSellMarket(body) {
    const { asset, currency, email, amount, amountType } = body
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
      bot: body.botId,
      side: 'sell',
      type: order.type,
    } as Transaction
    const isTransaction = await this.transactionRepository.create(transaction)
    const newTransaction = await this.transactionRepository.save(isTransaction)
    return newTransaction
  }

  async createBotToken(id: number, body: payloadBotReq) {
    const user = await this.userService.findOne({ id })
    const bot = {
      name: body.name,
      asset: body.asset,
      currency: body.currency,
      amount: body.amount,
      amountType: body.amountType,
      user: user,
    } as MyBot
    if (!bot.user)
      throw new NotFoundException("can't build token, is query failed")
    const data = await this.myBotRepository.create(bot)
    const newBot = await this.myBotRepository.save(data)
    delete newBot.createdAt
    delete newBot.deletedAt
    delete newBot.updatedAt
    const payload = await Object.assign(
      { id: user.id, email: user.email, botId: newBot.id },
      body,
    )
    const token = this.jwtService.sign(payload)
    const url = `http://localhost:8000/public-trade/order?token=${token}`
    return url
  }

  async decodeBotToken(token: string) {
    return this.jwtService.decode(token)
  }
}
