import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators'
import { BinanceCoinService } from './binance-coin.service'
import { CoinsPriceResDto, CoinsResDto } from './dtos/coins.dto'

@ApiTags('Binance-Spot')
@Controller('binance-coin')
export class BinanceCoinController {
  constructor(private readonly binanceCoinService: BinanceCoinService) {}

  @Auth()
  @Get('/coins')
  async coin(): Promise<CoinsResDto[]> {
    return await this.binanceCoinService.getCoinList()
  }

  @Auth()
  @ApiQuery({
    name: 'symbol',
    type: String,
    required: false,
  })
  @Get('/coins/price')
  async coinsPrice(
    @Query('symbol') symbol: string,
  ): Promise<CoinsPriceResDto[] | CoinsPriceResDto> {
    if (!symbol) {
      return await this.binanceCoinService.getCoinPrice()
    } else {
      return await this.binanceCoinService.getListCoinPrice(symbol)
    }
  }
  @Auth()
  @Get('/coins/asset')
  async coinsAsset(@Request() request) {
    const { email } = request.user.data
    return await this.binanceCoinService.getCoinAsset(email)
  }
  @Auth()
  @Get('/spot/balance')
  async freeBalance(@Request() request) {
    const { email } = request.user.data
    if (!email) throw new BadRequestException('email is valid')
    return await this.binanceCoinService.freeBalance(email)
  }

  @Auth()
  @Get('/spot/orders')
  async orders(@Request() request, @Query('symbol') symbol: string) {
    const { email } = request.user.data
    if (!symbol) throw new BadRequestException('symbol is valid')
    return await this.binanceCoinService.orders(email, symbol)
  }

  @Auth()
  @Delete('/spot/order/:orderid')
  async cancelOrder(
    @Param('orderid') orderid: string,
    @Request() request,
    @Query('symbol') symbol: string,
  ) {
    const { email } = request.user.data
    if (!symbol) throw new BadRequestException('symbol is valid')
    return await this.binanceCoinService.cancelOrderId(email, symbol, orderid)
  }

  @Auth()
  @Delete('/spot/orders')
  async cancelOrders(@Request() request, @Query('symbol') symbol: string) {
    const { email } = request.user.data
    return await this.binanceCoinService.cancelOrders(email, symbol)
  }

  @Auth()
  @Post('/spot/buy')
  async buy(@Request() request, @Query('symbol') symbol: string) {
    const { email } = request.user.data
    if (!symbol) throw new BadRequestException('symbol is valid')
    return await this.binanceCoinService.createLimitBuyOrder(
      email,
      symbol,
      0.042,
      350,
    )
  }

  @Auth()
  @Post('/spot/sell')
  async sell(@Request() request, @Query('symbol') symbol: string) {
    const { email } = request.user.data
    if (!symbol) throw new BadRequestException('symbol is valid')
    return await this.binanceCoinService.createLimitSellOrder(
      email,
      symbol,
      0.042,
      350,
    )
  }

  @Auth()
  @Post('/spot/buy/market')
  async buyMarket(@Request() request, @Query('symbol') symbol: string) {
    const { email } = request.user.data
    if (!symbol) throw new BadRequestException('symbol is valid')
    return await this.binanceCoinService.createMarketOrder(
      email,
      symbol,
      'BUY',
      0.042,
    )
  }

  @Auth()
  @Post('/spot/sell/market')
  async sellMarket(@Request() request, @Query('symbol') symbol: string) {
    const { email } = request.user.data
    if (!symbol) throw new BadRequestException('symbol is valid')
    return await this.binanceCoinService.createMarketOrder(
      email,
      symbol,
      'SELL',
      0.042,
    )
  }
}
