import { Controller, Delete, Get, Param } from '@nestjs/common'
import { BotUserService } from './bot-user.service'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/common/decorators'

@ApiTags('Manage bot')
@Controller('bot-user')
export class BotUserController {
  constructor(private readonly botUserService: BotUserService) {}

  @Auth()
  @Get('/:userId')
  async findAll(@Param('userId') userId: number) {
    const allBot = await this.botUserService.findAll(userId)
    return { message: 'this is all bot', data: allBot }
  }

  @Auth()
  @Delete('/:userId/:botId')
  async deleteBot(
    @Param('userId') userId: number,
    @Param('botId') botId: number,
  ) {
    await this.botUserService.deleteBot(botId)
    const allBot = await this.botUserService.findAll(userId)
    return { message: 'bot deleted', data: allBot }
  }
}
