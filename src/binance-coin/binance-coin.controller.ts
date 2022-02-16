import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BinanceCoinService } from './binance-coin.service';
import { CoinsPriceResDto, CoinsResDto } from './dtos/coins.dto';

@Controller('binance-coin')
export class BinanceCoinController {
    constructor(
        private readonly binanceCoinService: BinanceCoinService,
    ) {}

    @Get("/coins")
    async coin():Promise<CoinsResDto[]> {
        return await this.binanceCoinService.getCoinList()
    }
    
    @ApiQuery({
        name: "symbol",
        type: String,
        required: false
    })
    @Get("/coins/price")
    async coinsPrice(@Query('symbol') symbol: string):Promise<CoinsPriceResDto[]|CoinsPriceResDto> {
        if (!symbol) {
           return await this.binanceCoinService.getCoinPrice()
        } else {
           return await this.binanceCoinService.getListCoinPrice(symbol)
        }
    }
    @Post("/spot/orderBuy")
    async orderBuy(@Body('symbol') symbol: string) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.orderBuy(symbol)
    }
}
