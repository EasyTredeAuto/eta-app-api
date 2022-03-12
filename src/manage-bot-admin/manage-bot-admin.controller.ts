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
import { ApiTags } from '@nestjs/swagger'
import { AppRoles } from 'src/app.roles'
import { Auth } from 'src/common/decorators'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { UserService } from 'src/user/user.service'
import { payloadBotReq, payloadUpdateBotReq } from './dtos/create-bot-dto'
import { BotAdminService } from './manage-bot-admin.service'

@ApiTags('Manage-Bot')
@Controller('manage-bot-admin')
export class ManageBotAdminController {
  constructor(
    private readonly botsService: BotAdminService,
    private readonly botBinanceTradeService: BotBinanceTradeService,
    private readonly userService: UserService,
  ) {}

  @Auth()
  @Get('/:page/:size')
  async findAll(
    @Param('page') page: number,
    @Param('size') size: number,
    @Request() request,
  ) {
    const { id, roles } = request.user.data
    if (roles !== AppRoles.ADMIN)
      throw new BadRequestException('Forbidden resource')
    const allBot = await this.botsService.findAllAndCount(
      { user: id },
      page,
      size,
    )
    let data = JSON.parse(JSON.stringify(allBot.data))
    data.forEach((x) => {
      x.round = allBot.mappings.filter((y) => y.bot.id === x.id).length
    })
    return { message: 'this is all bot', data, count: allBot.count }
  }

  @Auth()
  @Post()
  async createTokenBot(@Body() body: payloadBotReq, @Request() request) {
    const { id, email, roles } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (
      !body ||
      !body.symbol ||
      !body.name ||
      !body.detail ||
      !body.asset ||
      !body.currency
    )
      throw new BadRequestException("can't build token, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    if (roles !== AppRoles.ADMIN)
      throw new BadRequestException('Forbidden resource')

    const url = await this.botBinanceTradeService.createBotByAdmin(
      user.id,
      body,
    )
    return { message: 'create bot success', ...url }
  }

  @Auth()
  @Put()
  async updateTokenBot(@Body() body: payloadUpdateBotReq, @Request() request) {
    const { id, email, roles } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (
      !body ||
      !body.id ||
      !body.symbol ||
      !body.name ||
      !body.detail ||
      !body.asset ||
      !body.currency
    )
      throw new BadRequestException("can't build token, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    if (roles !== AppRoles.ADMIN)
      throw new BadRequestException('Forbidden resource')

    const url = await this.botBinanceTradeService.updateBotByAdmin(
      user.id,
      body,
    )
    return { message: 'create bot success', ...url }
  }

  @Auth()
  @Delete('/:botId')
  async deleteBot(@Param('botId') botId: number, @Request() request) {
    const { id } = request.user.data
    await this.botsService.delete(botId)
    const allBot = await this.botsService.findAllAndCount({ id }, 0, 10)
    return { message: 'bot deleted', data: allBot }
  }
}
