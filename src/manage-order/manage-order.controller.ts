import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common'
import { OrderUserService } from './manage-order.service'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators'
import {
  payloadOrderReq,
  payloadOrderUpdateReq,
} from './dtos/create-bot-user-dto'
import { UserService } from 'src/user/user.service'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'

@ApiTags('Manage orders')
@Controller('manage-orders')
export class OrderUserController {
  constructor(
    private readonly botBinanceTradeService: BotBinanceTradeService,
    private readonly orderUserService: OrderUserService,
    private readonly userService: UserService,
  ) {}

  @Auth()
  @Get('/:page/:size')
  async findAll(
    @Param('page') page: number,
    @Param('size') size: number,
    @Request() request,
  ) {
    const { id } = request.user.data
    const allBot = await this.orderUserService.findAllAndCount(
      { user: id },
      page,
      size,
    )
    return { message: 'this is all bot', ...allBot }
  }

  @Auth()
  @Post()
  async createTokenBot(@Body() body: payloadOrderReq, @Request() request) {
    const { id, email } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (
      !body ||
      !body.name ||
      !body.asset ||
      !body.currency ||
      !body.amount ||
      !body.amountType ||
      !body.side ||
      !body.type
    )
      throw new BadRequestException("can't build token, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const urlBot = await this.botBinanceTradeService.createOrderToken(
      user.id,
      body,
    )
    return { message: 'create bot success', url: urlBot }
  }

  @Auth()
  @Put()
  async updateTokenBot(
    @Body() body: payloadOrderUpdateReq,
    @Request() request,
  ) {
    const { id, email } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (
      !body ||
      !body.name ||
      !body.asset ||
      !body.currency ||
      !body.amount ||
      !body.amountType ||
      !body.side ||
      !body.type
    )
      throw new BadRequestException("can't build token, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const urlBot = await this.botBinanceTradeService.updateOrderToken(
      user.id,
      body,
    )
    return { message: 'update bot success', url: urlBot }
  }

  @Auth()
  @Delete('/:orderId')
  async deleteBot(@Param('orderId') orderId: number, @Request() request) {
    const { id } = request.user.data
    await this.orderUserService.deleteBot(orderId)
    const allBot = await this.orderUserService.findAll(id)
    return { message: 'bot deleted', data: allBot }
  }
}
