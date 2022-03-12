import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { Repository } from 'typeorm'
import {
  payloadActiveBotMappingReq,
  payloadBotMappingReq,
  payloadUpdateBotMappingReq,
} from './dtos/create-mapping'
import { BotsAdmin } from './entitys/manage-bots-admin.entity'
import { BotsUserMapping } from './entitys/use-bots-user.entity'

@Injectable()
export class BotAdminService {
  constructor(
    @InjectRepository(BotsAdmin)
    private mangeBotRepository: Repository<BotsAdmin>,
    @InjectRepository(BotsUserMapping)
    private useBotRepository: Repository<BotsUserMapping>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
  async findOne(where) {
    return await this.mangeBotRepository.findOne({ where })
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
  async createOneMapping(data: payloadBotMappingReq, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const bot = await this.mangeBotRepository.findOne({
      where: { id: data.botId },
    })
    const botMapping = {
      amount: data.amount,
      amountType: data.amountType,
      type: data.type,
      bot: bot,
      user: user,
    } as BotsUserMapping
    const preBot = await this.useBotRepository.create(botMapping)
    return await this.useBotRepository.save(preBot)
  }
  async updateOneMapping(data: payloadUpdateBotMappingReq, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const bot = await this.mangeBotRepository.findOne({
      where: { id: data.botId },
    })
    const botMapping = {
      amount: data.amount,
      amountType: data.amountType,
      type: data.type,
      bot: bot,
      user: user,
    } as BotsUserMapping
    await this.useBotRepository.update({ id: data.id }, botMapping)
    return await this.useBotRepository.findOne({ where: { id: data.id } })
  }
  async updateOneActive(id: number, data: payloadActiveBotMappingReq) {
    await this.useBotRepository.update({ id }, { active: data.active })
    return await this.useBotRepository.findOne({ where: { id } })
  }
  async deleteMapping(id: number) {
    return await this.useBotRepository.softDelete({
      id,
    })
  }
}
