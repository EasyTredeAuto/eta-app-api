import { Injectable } from '@nestjs/common'
import { MyBot } from './mybot.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BotUserService {
  constructor(
    @InjectRepository(MyBot)
    private myBotRepository: Repository<MyBot>,
  ) {}

  async findAllAndCount(where: any, page: number, size: number) {
    const [result, total] = await this.myBotRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result, count: total }
  }

  async findAll(id: number) {
    return await this.myBotRepository.find({ where: { id } })
  }

  async findBot(id: number) {
    return await this.myBotRepository.findOne({ where: { id } })
  }

  async deleteBot(id: number) {
    return await this.myBotRepository.softDelete(id)
  }
}
