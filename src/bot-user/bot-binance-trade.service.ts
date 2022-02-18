import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BinanceCoinService } from 'src/binance-coin/binance-coin.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction-mybot.entity';

@Injectable()
export class BotBinanceTradeService {
    constructor(
        @InjectRepository(Transaction) 
        private transactionRepository: Repository<Transaction>,
        private readonly binanceService: BinanceCoinService,
    ) {}

    async createOrderBuyLimit(body) {
        const { asset, currency, email, amount, amountType } = body
        let isAmount
        const symbol = `${asset}${currency}`
        const balance = await this.binanceService.freeBalance(email)
        const market = await this.binanceService.getListCoinPrice(symbol)
        const price = parseFloat(market.price)
        if (amountType === 'amount') isAmount = amount / price
        else isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
        if (balance.total[currency] < isAmount * price) throw new BadRequestException("can't buy limit in whit balance")
        const order = await this.binanceService.createLimitBuyOrder(email, symbol, isAmount, price)
        const transaction = { symbol, amount, quantity: order.amount, price: order.price, defaultBotId: body.botId, botId:body.botId, side: 'buy' } as Transaction
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
        else isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
        if ((balance.total[asset]  || 0) < isAmount) throw new BadRequestException("can't sell limit in whit balance")
        const order = await this.binanceService.createLimitSellOrder(email, symbol, isAmount, price)
        const transaction = { symbol, amount, quantity: order.amount, price: order.price, defaultBotId: body.botId, botId:body.botId, side: 'sell' } as Transaction
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
        else isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
        if ((balance.total[asset]  || 0) < isAmount) throw new BadRequestException("can't buy market in whit balance")
        const order = await this.binanceService.createMarketOrder(email, symbol, 'BUY', isAmount)
        const transaction = { symbol, amount, quantity: order.amount, price: order.price, defaultBotId: body.botId, botId:body.botId, side: 'buy' } as Transaction
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
        else isAmount = (parseFloat(balance.total[currency]) * (amount / 100)) / price
        if ((balance.total[asset]  || 0) < isAmount) throw new BadRequestException("can't sell market in whit balance")
        const order = await this.binanceService.createMarketOrder(email, symbol, 'SELL', isAmount)
        const transaction = { symbol, amount, quantity: order.amount, price: order.price, defaultBotId: body.botId, botId:body.botId, side: 'sell' } as Transaction
        const isTransaction = await this.transactionRepository.create(transaction)
        const newTransaction = await this.transactionRepository.save(isTransaction)
        return newTransaction
    }
}
