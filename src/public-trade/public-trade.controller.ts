import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { payloadBotDe } from 'src/bot-user/dtos/decode-payload.dto'
import { ApiTags } from '@nestjs/swagger'
import { BotUserService } from 'src/bot-user/bot-user.service'

@ApiTags('Public trade')
@Controller('public-trade')
export class PublicTradeController {
  constructor(
    private readonly botBinanceTradeService: BotBinanceTradeService,
    private readonly botUserService: BotUserService,
  ) {}

  @Get('/order')
  async Trade(@Query('token') token: string) {
    if (!token) throw new NotFoundException('token does not exists')
    const result = (await this.botBinanceTradeService.decodeBotToken(
      token,
    )) as payloadBotDe
    if (
      !result ||
      !result.botId ||
      !result.name ||
      !result.symbol ||
      !result.amount ||
      !result.amountType
    )
      throw new BadRequestException('token does not used')
    const bot = await this.botUserService.findBot(result.botId)
    if (!bot) throw new NotFoundException('Bot does not exists')
    let res
    if (result.side === 'buy' && result.type === 'limit')
      res = await this.botBinanceTradeService.createOrderBuyLimit(result)
    if (result.side === 'sell' && result.type === 'limit')
      res = await this.botBinanceTradeService.createOrderSellLimit(result)
    if (result.side === 'buy' && result.type === 'market')
      res = await this.botBinanceTradeService.createOrderBuyMarket(result)
    if (result.side === 'sell' && result.type === 'market')
      res = await this.botBinanceTradeService.createOrderSellMarket(result)
    return { message: 'bot trade success', data: res }
  }
}
