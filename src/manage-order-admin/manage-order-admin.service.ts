import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ManageOrdersAdmin } from './manage-orders-admin.entity'

@Injectable()
export class OrderAdminService {
  constructor(
    @InjectRepository(ManageOrdersAdmin)
    private mangeOrdersRepository: Repository<ManageOrdersAdmin>,
  ) {}

  async getAll(where: any, size: number, page: number) {
    const [result, total] = await this.mangeOrdersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    return { data: result, count: total }
  }
}
