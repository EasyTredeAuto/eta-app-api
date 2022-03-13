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
  async findAll(where: any) {
    const result = await this.mangeBotRepository.find({
      where,
      order: { createdAt: 'DESC' },
    })
    result.forEach((x) => {
      delete x.round
      delete x.exchange
      delete x.createdAt
      delete x.updatedAt
      delete x.deletedAt
      delete x.urlBuy
      delete x.urlSell
      delete x.active
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

  // bot user mapping =====================================================================================================================
  async findAllAndCountMapping(where: any, page: number, size: number) {
    const [_result, total] = await this.useBotRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    const bots = await this.mangeBotRepository.find()
    let result = []
    for (const res of JSON.parse(JSON.stringify(_result))) {
      const optionBot = bots.find((x) => x.id === res.botIds)
      res.name = optionBot.name
      res.symbol = optionBot.symbol
      res.asset = optionBot.asset
      res.currency = optionBot.currency
      res.detail = optionBot.detail
      result.push(res)
    }
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
  async findOneMapping(where: any) {
    return await this.useBotRepository.findOne({
      where,
    })
  }
  async createOneMapping(data: payloadBotMappingReq, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const bot = await this.mangeBotRepository.findOne({
      where: { id: data.botId },
    })
    await this.mangeBotRepository.update(
      { id: data.botId },
      { round: bot.round + 1 },
    )
    const botMapping = {
      amount: data.amount,
      amountType: data.amountType,
      type: data.type,
      bot: bot,
      botIds: bot.id,
      userIds: user.id,
      user: user,
    } as BotsUserMapping
    const preBot = await this.useBotRepository.create(botMapping)
    return await this.useBotRepository.save(preBot)
  }
  async updateOneMapping(data: payloadUpdateBotMappingReq, userId: number) {
    // update round
    const user_bot = await this.useBotRepository.findOne({
      where: { id: data.id },
    })
    if (user_bot.botIds !== data.botId) {
      const bot_admin = await this.mangeBotRepository.findOne({
        where: { id: user_bot.botIds },
      })
      const new_bot_admin = await this.mangeBotRepository.findOne({
        where: { id: data.botId },
      })
      await this.mangeBotRepository.update(
        { id: data.botId },
        { round: new_bot_admin.round + 1 },
      )
      await this.mangeBotRepository.update(
        { id: user_bot.botIds },
        { round: bot_admin.round - 1 },
      )
    }

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
      botIds: data.botId,
      userIds: user.id,
    } as BotsUserMapping
    await this.useBotRepository.update({ id: data.id }, botMapping)
    return await this.useBotRepository.findOne({ where: { id: data.id } })
  }
  async updateOneActive(id: number, data: payloadActiveBotMappingReq) {
    await this.useBotRepository.update({ id }, { active: data.active })
    return await this.useBotRepository.findOne({ where: { id } })
  }
  async deleteMapping(botId: number, id: number) {
    const bot = await this.mangeBotRepository.findOne({
      where: { id: botId },
    })
    await this.mangeBotRepository.update(
      { id: botId },
      { round: bot.round - 1 },
    )
    return await this.useBotRepository.softDelete({
      id,
    })
  }
}
