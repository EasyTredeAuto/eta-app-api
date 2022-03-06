import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppRoles } from 'src/app.roles'
import { Auth } from 'src/common/decorators'
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service'
import { UserService } from 'src/user/user.service'
import { payloadOrderReq } from './dtos/payloadOrderReq.dtos'
import { OrderAdminService } from './manage-order-admin.service'

@ApiTags('Manage orders admin')
@Controller('manage-order-admin')
export class ManageOrderAdminController {
  constructor(
    private readonly botBinanceTradeService: BotBinanceTradeService,
    private readonly manageOrderAdminService: OrderAdminService,
    private readonly userService: UserService,
  ) {}

  @Auth()
  @Get('/:page/:size')
  async findAll(
    @Param('page') page: number,
    @Param('size') size: number,
    @Request() request,
  ) {
    const { roles, id } = request.user.data
    if (roles !== AppRoles.ADMIN)
      throw new BadRequestException('Forbidden resource')
    return await this.manageOrderAdminService.getAll({ user: id }, size, page)
  }

  @Auth()
  @Post()
  async createOrder(@Body() body: payloadOrderReq, @Request() request) {
    const { id, email, roles } = request.user.data
    if (roles !== AppRoles.ADMIN)
      throw new BadRequestException('Forbidden resource')
    if (!id) throw new NotFoundException('User does not exists')
    if (
      !body ||
      !body.name ||
      !body.asset ||
      !body.currency ||
      !body.side ||
      !body.exchange ||
      !body.description
    )
      throw new BadRequestException("can't build token, is query failed")
    const user = await this.userService.findOne({
      id,
      email,
    })
    if (!user) throw new NotFoundException('User does not exists')
    const urlOrder = await this.botBinanceTradeService.createAdminOrder(
      user.id,
      body,
    )
    return { message: 'create order success', url: urlOrder }
  }
}
