import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { payloadOrderDe } from 'src/manage-order/dtos/decode-payload.dto'
import {
  payloadOrderReq,
  payloadOrderUpdateReq,
} from 'src/manage-order/dtos/create-bot-user-dto'
import { ApiTags } from '@nestjs/swagger'
import { OrderUserService } from 'src/manage-order/manage-order.service'
import { BotAdminService } from 'src/manage-bot-admin/manage-bot-admin.service'
import { payloadBotToken } from 'src/manage-bot-admin/dtos/create-bot-dto'

@ApiTags('Public trade')
@Controller('public-trade')
export class PublicTradeController {
  constructor(
    private readonly botBinanceTradeService: BotBinanceTradeService,
    private readonly orderUserService: OrderUserService,
    private readonly botsRepository: BotAdminService,
  ) {}

  @Get('/order')
  async Trade(@Query('token') token: string) {
    if (!token) throw new NotFoundException('token does not exists')
    const result = (await this.botBinanceTradeService.decodeOrderToken(
      token,
    )) as payloadOrderDe
    if (
      !result ||
      !result.orderId ||
      !result.name ||
      !result.asset ||
      !result.currency ||
      !result.amount ||
      !result.amountType
    )
      throw new BadRequestException('token does not used')
    const bot = await this.orderUserService.findBot(result.orderId)
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

  @Get('/order/admin')
  async TradeAdmin(@Query('token') token: string) {
    if (!token) throw new NotFoundException('token does not exists')
    const result = (await this.botBinanceTradeService.decodeBotToken(
      token,
    )) as payloadBotToken
    if (
      !result ||
      !result.botId ||
      !result.name ||
      !result.asset ||
      !result.currency
    )
      throw new BadRequestException('token does not used')
    const order = await this.botsRepository.findOne(result.botId)
    if (!order) throw new NotFoundException('Bot does not exists')

    let res
    // if (result.side === 'buy' && result.type === 'limit')
    //   res = await this.botBinanceTradeService.createOrderBuyLimit(result)
    // if (result.side === 'sell' && result.type === 'limit')
    //   res = await this.botBinanceTradeService.createOrderSellLimit(result)
    // if (result.side === 'buy' && result.type === 'market')
    //   res = await this.botBinanceTradeService.createOrderBuyMarket(result)
    // if (result.side === 'sell' && result.type === 'market')
    //   res = await this.botBinanceTradeService.createOrderSellMarket(result)
    return { message: 'bot trade success', data: order }
  }
}
