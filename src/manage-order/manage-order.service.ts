import { Injectable } from '@nestjs/common'
import { ManageOrders } from './manage-orders.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BotUserService {
  constructor(
    @InjectRepository(ManageOrders)
    private mangeOrdersRepository: Repository<ManageOrders>,
  ) {}

  async findAllAndCount(where: any, page: number, size: number) {
    const [result, total] = await this.mangeOrdersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result, count: total }
  }

  async findAll(id: number) {
    return await this.mangeOrdersRepository.find({ where: { id } })
  }

  async findBot(id: number) {
    return await this.mangeOrdersRepository.findOne({ where: { id } })
  }

  async deleteBot(id: number) {
    return await this.mangeOrdersRepository.softDelete(id)
  }
}
