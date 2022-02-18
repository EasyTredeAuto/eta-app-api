import { BadRequestException, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BinanceCoinService } from './binance-coin.service';
import { CoinsPriceResDto, CoinsResDto } from './dtos/coins.dto';

@ApiTags('Binance-Spot')
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
    @Get("/spot/balance")
    async freeBalance(@Query('email') email: string) {
        if (!email) throw new BadRequestException("email is valid");
        return  await this.binanceCoinService.freeBalance(email)
    }
    @Get("/spot/orders")
    async orders(
            @Query('email') email: string,
            @Query('symbol') symbol: string
        ) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.orders(email, symbol)
    }
    @Delete("/spot/order/:orderid")
    async cancelOrder(
            @Param("orderid") orderid: string,
            @Query('email') email: string,
            @Query("symbol") symbol: string
        ) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.cancelOrderId(email, symbol, orderid)
    }
    @Delete("/spot/orders")
    async cancelOrders(
            @Query('email') email: string,
            @Query("symbol") symbol: string
        ) {
        return  await this.binanceCoinService.cancelOrders(email, symbol)
    }
    @Post("/spot/buy")
    async buy(
            @Query('email') email: string,
            @Query("symbol") symbol: string
        ) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.createLimitBuyOrder(email, symbol, 0.042, 350)
    }
    @Post("/spot/sell")
    async sell(
            @Query('email') email: string,
            @Query("symbol") symbol: string
        ) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.createLimitSellOrder(email, symbol, 0.042, 350)
    }
    @Post("/spot/buy/market")
    async buyMarket(
            @Query('email') email: string,
            @Query("symbol") symbol: string
        ) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.createMarketOrder(email, symbol, 'BUY', 0.042)
    }
    @Post("/spot/sell/market")
    async sellMarket(
            @Query('email') email: string,
            @Query("symbol") symbol: string
        ) {
        if (!symbol) throw new BadRequestException("symbol is valid");
        return  await this.binanceCoinService.createMarketOrder(email, symbol, 'SELL', 0.042)
    }
}
