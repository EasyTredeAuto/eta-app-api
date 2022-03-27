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
  Query,
  Request,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppRoles } from 'src/app.roles'
import { Auth } from 'src/common/decorators'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { UserService } from 'src/user/user.service'
import { Like } from 'typeorm'
import { payloadBotReq, payloadUpdateBotReq } from './dtos/create-bot-dto'
import { payloadActiveBotMappingReq } from './dtos/create-mapping'
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
    @Query('search') search: string,
    @Request() request,
  ) {
    const { id, roles } = request.user.data
    if (roles !== AppRoles.ADMIN)
      throw new BadRequestException('Forbidden resource')
    const allBot = await this.botsService.findAllAndCount(
      { user: id, name: Like(`%${search}%`) },
      page,
      size,
    )
    return { message: 'this is all bot', ...allBot }
  }

  @Auth()
  @Get('/options')
  async findAllOption() {
    const allBot = await this.botsService.findAll({ active: true })
    return { message: 'this is all bot', ...allBot }
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
  @Put('/:botId')
  async activeBot(
    @Body() body: payloadActiveBotMappingReq,
    @Param('botId') botId: number,
    @Request() request,
  ) {
    const { id, email } = request.user.data

    if (!id) throw new NotFoundException('User does not exists')
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const bot = await this.botsService.findOne({
      id: botId,
      user: id,
    })
    if (!bot)
      return { message: 'This bot does not exist in your list.', data: false }
    const data = await this.botsService.updateActive(botId, body)
    return { message: 'successful', data }
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
