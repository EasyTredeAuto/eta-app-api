import { Injectable } from '@nestjs/common'
import { Orders } from './manage-orders.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class OrderUserService {
  constructor(
    @InjectRepository(Orders)
    private mangeOrdersRepository: Repository<Orders>,
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
