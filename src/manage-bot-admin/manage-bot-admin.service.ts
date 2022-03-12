import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BotsAdmin } from './entitys/manage-bots-admin.entity'
import { BotsUserMapping } from './entitys/use-bots-user.entity'

@Injectable()
export class BotAdminService {
  constructor(
    @InjectRepository(BotsAdmin)
    private mangeBotRepository: Repository<BotsAdmin>,
    @InjectRepository(BotsUserMapping)
    private useBotRepository: Repository<BotsUserMapping>,
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

  // bot user mapping
  async findAllAndCountMapping(where: any, page: number, size: number) {
    const [result, total] = await this.useBotRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result, count: total }
  }
  async findAllMapping(where: any, page: number, size: number) {
    const result = await this.useBotRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result }
  }
  async findOneMapping(id: number) {
    return await this.useBotRepository.findOne({
      where: { id },
    })
  }
  async deleteMapping(id: number) {
    return await this.useBotRepository.softDelete({
      id,
    })
  }
}
