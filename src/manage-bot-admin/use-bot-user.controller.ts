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
import {
  payloadActiveBotMappingReq,
  payloadBotMappingReq,
  payloadUpdateBotMappingReq,
} from './dtos/create-mapping'
import { BotAdminService } from './manage-bot-admin.service'

@ApiTags('Use-Bot')
@Controller('use-bot-user')
export class UseBotByUserController {
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
    const allBot = await this.botsService.findAllAndCountMapping(
      { user: id },
      page,
      size,
    )
    return { message: 'this is all bot', ...allBot }
  }

  @Auth()
  @Post()
  async createBotMapping(
    @Body() body: payloadBotMappingReq,
    @Request() request,
  ) {
    const { id, email } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (!body || !body.amount || !body.amountType || !body.type || !body.botId)
      throw new BadRequestException("can't use bot, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })

    if (!user) throw new NotFoundException('User does not exists')
    const mapping = await this.botsService.findOneMapping({
      user: id,
      bot: body.botId,
    })
    if (mapping)
      return { message: 'You have already run this bot.', data: false }
    const data = this.botsService.createOneMapping(body, id)
    return { message: 'successful', data }
  }

  @Auth()
  @Put()
  async updateMappingBot(
    @Body() body: payloadUpdateBotMappingReq,
    @Request() request,
  ) {
    const { id, email } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (
      !body ||
      !body.id ||
      !body.amount ||
      !body.amountType ||
      !body.type ||
      !body.botId
    )
      throw new BadRequestException("can't use bot, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const mapping = await this.botsService.findOne({
      user: id,
      bot: body.botId,
    })
    if (!mapping)
      return { message: 'This bot does not exist in your list.', data: false }
    const data = this.botsService.updateOneMapping(body, id)
    return { message: 'update bot success', data }
  }

  @Auth()
  @Put('/:mappingId')
  async activeMappingBot(
    @Body() body: payloadActiveBotMappingReq,
    @Param('mappingId') mappingId: number,
    @Request() request,
  ) {
    const { id, email } = request.user.data
    if (!id) throw new NotFoundException('User does not exists')
    if (!body || !body.active || !body.botId)
      throw new BadRequestException("can't use bot, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const mapping = await this.botsService.findOne({
      id: mappingId,
      user: id,
      bot: body.botId,
    })
    if (!mapping)
      return { message: 'This bot does not exist in your list.', data: false }
    const data = this.botsService.updateOneActive(mappingId, body)
    return { message: 'update bot success', data }
  }

  @Auth()
  @Delete('/:botId/:mappingId')
  async deleteBot(
    @Param('botId') botId: number,
    @Param('mappingId') mappingId: number,
    @Request() request,
  ) {
    const { id } = request.user.data
    await this.botsService.deleteMapping(botId, mappingId)
    const allBot = await this.botsService.findAllAndCountMapping({ id }, 0, 10)
    return { message: 'bot deleted', data: allBot }
  }
}
