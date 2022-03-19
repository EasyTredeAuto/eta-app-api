import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common'
import { Auth } from 'src/common/decorators'
import { payloadApiReq } from './dtos/paloadReq.dto'
import { SettingApiService } from './setting-api.service'

@Controller('setting-api')
export class SettingApiController {
  constructor(private settingApiService: SettingApiService) {}

  @Auth()
  @Get('exchange/:exchange')
  async getOneApi(@Request() request, @Param('exchange') exchange: string) {
    const { id } = request.user.data
    const api = await this.settingApiService.getOne({ user: id, exchange })
    if (!api) throw new NotFoundException('Value does not exists')
    return { message: 'this is api on exchange ' + exchange, data: { ...api } }
  }

  @Auth()
  @Get('/check')
  async getCheckOneApi(@Request() request) {
    const { id } = request.user.data
    const api = await this.settingApiService.getOne({ user: id, active: true })
    if (!api) throw new NotFoundException('Value does not exists')
    return { message: 'api your is active', data: true }
  }

  @Auth()
  @Post()
  async createOneApi(@Request() request, @Body() body: payloadApiReq) {
    const { id } = request.user.data
    if (!body.id) {
      await this.settingApiService.createOne(id, {
        apiKey: body.apiKey,
        secretKey: body.secretKey,
        exchange: body.exchange,
      })
    } else {
      await this.settingApiService.updateOne(body.id, {
        apiKey: body.apiKey,
        secretKey: body.secretKey,
      })
    }
    const api = await this.settingApiService.getOne({
      user: id,
      exchange: body.exchange,
    })
    if (!api) throw new NotFoundException('Value does not exists')
    return {
      message: 'success, this is api on exchange ' + body.exchange,
      data: { ...api },
    }
  }
}
