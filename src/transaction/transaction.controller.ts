import { Controller, Get, Param, Query, Request } from '@nestjs/common'
import { BotUserService } from 'src/bot-user/bot-user.service'
import { Auth } from 'src/common/decorators'
import { Between } from 'typeorm'
import { transactionQueryReq } from './dtos/transaction.query.dto'
import { TransactionService } from './transaction.service'

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly botUserService: BotUserService,
  ) {}

  @Auth()
  @Get('/:page/:size')
  async transactions(
    @Param('page') page: number,
    @Param('size') size: number,
    @Query() query: transactionQueryReq,
    @Request() request,
  ) {
    const { id } = request.user.data
    const where = !query.bot ? Object.assign({ user: id }, query) : query
    const { data, count } = await this.transactionService.getAll(
      where,
      page,
      size,
    )
    return { message: 'transaction', page, size, count, data }
  }
}
