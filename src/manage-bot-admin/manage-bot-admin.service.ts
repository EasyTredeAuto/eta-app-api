import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BotsAdmin } from './manage-bots-admin.entity'

@Injectable()
export class BotAdminService {
  constructor(
    @InjectRepository(BotsAdmin)
    private mangeBotRepository: Repository<BotsAdmin>,
  ) {}

  async findAllAndCount(where: any, page: number, size: number) {
    const [result, total] = await this.mangeBotRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result, count: total }
  }
  async findAll(where: any, page: number, size: number) {
    const result = await this.mangeBotRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result }
  }
  async findOne(id: number) {
    return await this.mangeBotRepository.findOne({
      where: { id },
    })
  }
  async delete(id: number) {
    return await this.mangeBotRepository.softDelete({
      id,
    })
  }
}
