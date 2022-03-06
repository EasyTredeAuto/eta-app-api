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
import { BotUserService } from './manage-order.service'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators'
import { payloadBotReq, payloadBotUpdateReq } from './dtos/create-bot-user-dto'
import { UserService } from 'src/user/user.service'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'

@ApiTags('Manage orders')
@Controller('mange-orders')
export class BotUserController {
  constructor(
    private readonly botBinanceTradeService: BotBinanceTradeService,
    private readonly botUserService: BotUserService,
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
    const allBot = await this.botUserService.findAllAndCount(
      { user: id },
      page,
      size,
    )
    return { message: 'this is all bot', ...allBot }
  }

  @Auth()
  @Post()
  async createTokenBot(@Body() body: payloadBotReq, @Request() request) {
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
    const urlBot = await this.botBinanceTradeService.createBotToken(
      user.id,
      body,
    )
    return { message: 'create bot success', url: urlBot }
  }

  @Auth()
  @Put()
  async updateTokenBot(@Body() body: payloadBotUpdateReq, @Request() request) {
    console.log(body)
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
    const urlBot = await this.botBinanceTradeService.updateBotToken(
      user.id,
      body,
    )
    return { message: 'update bot success', url: urlBot }
  }

  @Auth()
  @Delete('/:botId')
  async deleteBot(@Param('botId') botId: number, @Request() request) {
    const { id } = request.user.data
    await this.botUserService.deleteBot(botId)
    const allBot = await this.botUserService.findAll(id)
    return { message: 'bot deleted', data: allBot }
  }
}
