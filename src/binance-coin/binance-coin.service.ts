import { BadRequestException, Injectable } from '@nestjs/common';
import { Ajax } from 'src/utils/ajax';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AjaxLocal } from 'src/utils/ajaxLocal';
// import env from 'src/utils/env';
// import { cryptoHandleHmac } from '../common/helper/cryptoHandle';
// import axios from 'axios';
// import crypto from "crypto";

@Injectable()
export class BinanceCoinService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly ajax: Ajax,
        private readonly ajaxLocal: AjaxLocal,
    ) {}
    
    // async configKey(symbol:string, side:string, type: string, quantity: number, price: number) {
    //     const user = await this.userService.findSecret({email: "ton.watthanard@gmail.com"})
    //     const dataQueryString = `symbol=${symbol}&side=${side}&type${type}&timeInForce=GTC&quantity=${quantity}&price=${price}&recvWindow=20000&timestamp=` + Date.now()
    //     const keys = {
    //         "akey": user.binance_api,
    //         "skey": user.binance_secret_api
    //     }
    //     // const signature = await axios.get(`http://localhost:8001/gentoken?dataQueryString=${dataQueryString}&skey=${keys['skey']}`).then(res=>res.data) 
    //     const signature = crypto.createHmac('sha256', keys['skey']).update(dataQueryString).digest('hex')
    //     console.log(signature)
    //     const baseUrl = this.configService.get(env.BINANCE_BASE_URL)
    //     const url = `${baseUrl}?${dataQueryString}&signature=${signature}`
    //     const ourRequest = new XMLHttpRequest()
    //     ourRequest.open('POST', url, true)
    //     ourRequest.setRequestHeader('X-MBX-APIKEY', keys['akey'])
    //     ourRequest.onload = function () {
    //         console.log(ourRequest.responseText)
    //     }
    //     ourRequest.send()
    // }

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
    
    async orderBuy(symbol) {
        const user = await this.userService.findSecret({email: "ton.watthanard@gmail.com"})
        const body = { symbol, type:'limit', side:'buy', amount: 0.025, price:400 }
        const data = await this.ajaxLocal.post('/binance/spot/orderBuy', body, {apiKey: user.binance_api, secret:user.binance_secret_api})
        return {msg: "success", data}
    }
}
