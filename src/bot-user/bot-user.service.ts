import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { payloadBotReq } from './dtos/create-bot-user-dto';
import { JwtService } from '@nestjs/jwt';
import { MyBot } from './mybot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BotUserService {
    constructor(
        @InjectRepository(MyBot) 
        private myBotRepository: Repository<MyBot>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async createBotToken(id: number, body:payloadBotReq) {
      const user = await this.userService.findOne({id})
      const bot = { 
        name: body.name, 
        asset: body.asset, 
        currency: body.currency, 
        amount: body.amount, 
        amountType: body.amountType, 
        user: user
      } as MyBot
      const data = await this.myBotRepository.create(bot)
      const newBot = await this.myBotRepository.save(data)
      delete newBot.createdAt
      delete newBot.deletedAt
      delete newBot.updatedAt
      const payload = await Object.assign({id: user.id, email: user.email, botId:newBot.id }, body)
      const token = this.jwtService.sign(payload)
      const url = `http://localhost:8000/bot-user/order?token=${token}`
      return url
    }
    
    async findAll(id:number) {
      return await this.myBotRepository.find({where: {user: id}})
    }

    async findBot(id:number) {
      return await this.myBotRepository.findOne({where: {id}})
    }
    
    async deleteBot(id:number) {
      return await this.myBotRepository.softDelete(id)
    }

    async decodeBotToken(token:string) {
      return this.jwtService.decode(token)
    }
}
