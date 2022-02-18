import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Ajax } from 'src/utils/ajax';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as ccxt from 'ccxt';

@Injectable()
export class BinanceCoinService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly ajax: Ajax,
        @Inject(CACHE_MANAGER) private readonly cacheManager: any,
    ) {}

    async _getExchangeInstance(email: string):Promise<ccxt.Exchange>{
        const user = await this.userService.findSecret({email})
        const keys = {
            "akey": user.binance_api,
            "skey": user.binance_secret_api
        }
        const key = `${user.email}:${user.id}`
        let ex = await this.cacheManager.get(key);
        const proxy = this.configService.get('PROXY') ? this.configService.get('PROXY') : null
        const agent = proxy ? new HttpsProxyAgent(proxy) : null;
        ex =  new ccxt.binance({
            httpsAgent: agent, 
            apiKey: keys.akey, 
            secret: keys.skey,
            'verbose': false,
            options: { adjustForTimeDifference: true }
        });
        await this.cacheManager.set(key, ex)
        return ex
    }
    async getCoinList() {
       const coins =  await this.ajax.get('/ticker/bookTicker')
       if (!coins.data) {
           throw new BadRequestException('fetch coins failed')
       }
       return coins
    }
    async getCoinPrice() {
       const coinsPrice =  await this.ajax.get('/ticker/price')
       if (!coinsPrice) {
           throw new BadRequestException('fetch coins price failed')
       }
       return coinsPrice
    }
    async getListCoinPrice(symbol) {
       const coinsPrice =  await this.ajax.get(`/ticker/price?symbol=${symbol}`)
       if (!coinsPrice) {
           throw new BadRequestException('fetch coins price failed')
       }
       return coinsPrice
    }
    async freeBalance(email:string) {
        const exchange = await this._getExchangeInstance(email)
        const result = await exchange.fetchBalance()
        const filteredObject = Object.keys(result.total).reduce(function(r, e) {
            if (result.total[e] > 0 && !e.startsWith("LD")) r[e] = result.total[e]
            return r;
        }, {})
        delete result.info.balances
        delete result.info.permissions
        const balance = {
            info: result.info,
            total: filteredObject
        }
        return balance
    }
    async orders(email:string, symbol:string) {
        const exchange = await this._getExchangeInstance(email)
        const result = await exchange.fetchOpenOrders(symbol, 50)
        const orders = result.map(res=>res.info)
        return orders
    }
    async cancelOrderId(email:string, symbol:string, orderid: string) {
        const exchange = await this._getExchangeInstance(email)
        const result = await exchange.cancelOrder(orderid, symbol)
        return result
    }
    async cancelOrders(email:string, symbol:string) {
        const exchange = await this._getExchangeInstance(email)
        const result = await exchange.cancelAllOrders(symbol)
        return result
    }
    async createLimitBuyOrder(email:string, symbol:string, amount:number, price:number) {
        const exchange = await this._getExchangeInstance(email)
        const result = await exchange.createLimitBuyOrder(symbol, amount, price)
        return result
    }
    async createLimitSellOrder(email:string, symbol:string, amount:number, price:number) {
        const exchange = await this._getExchangeInstance(email)
        const result = await exchange.createLimitSellOrder(symbol, amount, price)
        return result
    }
    async createMarketOrder(email:string, symbol:string, side: string, amount:number) {
        const exchange = await this._getExchangeInstance(email)
        const isSide = side === 'BUY' ? 'buy' : 'sell'
        const result = await exchange.createMarketOrder(symbol, isSide, amount)
        return result
    }
}
