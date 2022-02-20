import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators'
import { UserService } from 'src/user/user.service'
import { BinanceBotService } from './binance-bot.service'
import { CreateBotDto } from './dtos/create-bot.dto'
import { UpdateBotDto } from './dtos/update-bot.dto'

@ApiTags('binance-bot')
@Controller('binance-bot')
export class BinanceBotController {
  constructor(
    private readonly botService: BinanceBotService,
    private readonly userService: UserService,
  ) {}

  @Auth()
  @Get('/:userId')
  async findAllById(@Param('userId') userId: number) {
    return await this.botService.findAll(userId)
  }

  @Auth()
  @Get('/:userId')
  async findAll(@Param('userId') userId: number) {
    return await this.botService.findAll(userId)
  }

  @Auth()
  @Post('/:userId')
  async createOne(@Param('userId') userId: number, @Body() body: CreateBotDto) {
    return await this.botService.create(userId, body)
  }

  @Auth()
  @Put('/:botId')
  async updateOne(@Param('botId') botId: number, @Body() body: UpdateBotDto) {
    return await this.botService.update(botId, body)
  }

  @Auth()
  @Delete('/:botId')
  async delete(@Param('botId') botId: number) {
    return await this.botService.delete(botId)
  }
}
