import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { BotBinanceTradeService } from './bot-binance-trade.service';
import { BotUserService } from './bot-user.service';
import { payloadBotReq } from './dtos/create-bot-user-dto';
import { payloadBotDe } from './dtos/decode-payload.dto';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Binance-Spot, Make bot by user')
@Controller('bot-user')
export class BotUserController {
    constructor(
        private readonly botUserService: BotUserService,
        private readonly botBinanceTradeService: BotBinanceTradeService,
        private readonly userService: UserService
    ){}

    @Post('/:userId')
    async createTokenBot(
        @Param('userId') userId: number,
        @Body() body: payloadBotReq
    ) {
        if (!userId || !body.email) throw new NotFoundException('User does not exists')
        const user = await this.userService.findOne({id: userId, email: body.email })
        if (!user) throw new NotFoundException('User does not exists')
        const urlBot = await this.botUserService.createBotToken(user.id, body)
        return { message:"create bot success", url:urlBot }
    }
    
    @Get('/order')
    async Trade(@Query('token') token: string) {
        const result = await this.botUserService.decodeBotToken(token) as payloadBotDe
        let res
        if (result.side === 'buy' && result.type === 'limit') res = await this.botBinanceTradeService.createOrderBuyLimit(result)
        if (result.side === 'sell' && result.type === 'limit') res = await this.botBinanceTradeService.createOrderSellLimit(result)
        if (result.side === 'buy' && result.type === 'market') res = await this.botBinanceTradeService.createOrderBuyMarket(result)
        if (result.side === 'sell' && result.type === 'market') res = await this.botBinanceTradeService.createOrderSellMarket(result)
        return {message: "bot trade success", data:res }
    }
}
