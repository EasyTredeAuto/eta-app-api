import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { BotBinanceTradeService } from 'src/public-trade/bot-binance-trade.service';
import { payloadBotReq } from 'src/bot-user/dtos/create-bot-user-dto';
import { UserService } from 'src/user/user.service';
import { BotUserService } from 'src/bot-user/bot-user.service';
import { payloadBotDe } from 'src/bot-user/dtos/decode-payload.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Make bot by user')
@Controller('public-trade')
export class PublicTradeController {
    
    constructor(
        private readonly userService: UserService,
        private readonly botBinanceTradeService: BotBinanceTradeService,
        private readonly botUserService: BotUserService

    ){}

    @Post('/:userId')
    async createTokenBot(
        @Param('userId') userId: number,
        @Body() body: payloadBotReq
    ) {
        if (!userId || !body.email) throw new NotFoundException('User does not exists')
        if (!body || !body.name || !body.asset || !body.currency || !body.amount || !body.amountType) 
            throw new BadRequestException("can't build token, is query failed")
        const user = await this.userService.findOne({id: userId, email: body.email })
        if (!user) throw new NotFoundException('User does not exists')
        const urlBot = await this.botUserService.createBotToken(user.id, body)
        return { message:"create bot success", url:urlBot }
    }

    @Get('/order')
    async Trade(@Query('token') token: string) {
        if (!token) throw new NotFoundException('token does not exists')
        const result = await this.botUserService.decodeBotToken(token) as payloadBotDe
        if (!result || !result.id || !result.name || !result.asset || !result.currency || !result.amount || !result.amountType) 
            throw new BadRequestException('token does not used')
        const bot = await this.botUserService.findBot(result.id)
        if (!bot) throw new NotFoundException('Bot does not exists')
        let res
        if (result.side === 'buy' && result.type === 'limit') res = await this.botBinanceTradeService.createOrderBuyLimit(result)
        if (result.side === 'sell' && result.type === 'limit') res = await this.botBinanceTradeService.createOrderSellLimit(result)
        if (result.side === 'buy' && result.type === 'market') res = await this.botBinanceTradeService.createOrderBuyMarket(result)
        if (result.side === 'sell' && result.type === 'market') res = await this.botBinanceTradeService.createOrderSellMarket(result)
        return {message: "bot trade success", data:res }
    }
}