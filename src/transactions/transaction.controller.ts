import { Controller, Get, Param, Query, Request } from '@nestjs/common'
import { Auth } from 'src/common/decorators'
import { transactionQueryReq } from './dtos/transaction.query.dto'
import { TransactionService } from './transaction.service'

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Auth()
  @Get('/:page/:size')
  async transactions(
    @Param('page') page: number,
    @Param('size') size: number,
    @Query() query: transactionQueryReq,
    @Request() request,
  ) {
    const { id } = request.user.data
    let where = { user: id }
    if (query.exchange)
      where = Object.assign(where, { exchange: query.exchange })
    if (query.symbol) where = Object.assign(where, { symbol: query.symbol })
    if (query.side) where = Object.assign(where, { side: query.side })
    if (query.type) where = Object.assign(where, { type: query.type })
    const { data, count } = await this.transactionService.getAll(
      where,
      page,
      size,
      query.from,
      query.to,
    )
    data.sort((a, b) => {
      return a.createdAt > b.createdAt ? a : b
    })
    data.forEach((x) => {
      x.amount = parseFloat(x.amount)
      x.quantity = parseFloat(x.quantity)
      x.price = parseFloat(x.price)
      return x
    })
    return { message: 'this is all transactions', page, size, count, data }
  }
}
