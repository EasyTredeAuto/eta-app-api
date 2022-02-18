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
      const bot = await Object.assign({defaultUserId: id}, body)
      const data = await this.myBotRepository.create(bot)
      const newBot = await this.myBotRepository.save(data)
      delete newBot.createdAt
      delete newBot.deletedAt
      delete newBot.updatedAt
      delete newBot.defaultUserId
      const payload = await Object.assign({id: user.id, email: user.email, botId:newBot.id }, body)
      const token = this.jwtService.sign(payload)
      const url = `http://localhost:8000/bot-user/order?token=${token}`
      return url
    }
    
    async decodeBotToken(token:string) {
      return this.jwtService.decode(token)
    }
}
