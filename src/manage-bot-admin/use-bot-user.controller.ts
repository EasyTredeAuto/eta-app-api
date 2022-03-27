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
import { Auth } from 'src/common/decorators'
import { UserService } from 'src/user/user.service'
import { Like } from 'typeorm'
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
    const { id } = request.user.data
    const allBot = await this.botsService.findAllAndCountMapping(
      { user: id },
      page,
      size,
      search,
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
    const data = await this.botsService.createOneMapping(body, id)
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
    const data = await this.botsService.updateOneMapping(body, id)
    return { message: 'successful', data: JSON.parse(JSON.stringify(data)) }
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
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const mapping = await this.botsService.findOneMapping({
      id: mappingId,
      user: id,
    })
    if (!mapping)
      return { message: 'This bot does not exist in your list.', data: false }
    const data = await this.botsService.updateOneActive(mappingId, body)
    return { message: 'successful', data }
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
    const allBot = await this.botsService.findAllAndCountMapping({ id }, 0, 10, '')
    return { message: 'bot deleted', data: allBot }
  }
}
