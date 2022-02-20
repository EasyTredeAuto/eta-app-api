import { Injectable } from '@nestjs/common'
import { MyBot } from './mybot.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BotUserService {
  constructor(
    @InjectRepository(MyBot)
    private myBotRepository: Repository<MyBot>
  ) {}

  async findAll(id: number) {
    return await this.myBotRepository.find({ where: { user: id } })
  }

  async findBot(id: number) {
    return await this.myBotRepository.findOne({ where: { id } })
  }

  async deleteBot(id: number) {
    return await this.myBotRepository.softDelete(id)
  }
}
