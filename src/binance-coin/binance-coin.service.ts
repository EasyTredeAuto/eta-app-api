import { BadRequestException, Injectable } from '@nestjs/common';
import { Ajax } from 'src/utils/ajax';

@Injectable()
export class BinanceCoinService {
    constructor(
        private readonly ajax: Ajax,
    ) {}
    
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
}
