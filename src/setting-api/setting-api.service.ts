import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/schemas/user.entity'
import { Repository } from 'typeorm'
import { ApiSetting } from '../schemas/user-secret-api.entity'

@Injectable()
export class SettingApiService {
  constructor(
    @InjectRepository(ApiSetting)
    private apiRepository: Repository<ApiSetting>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOneByUserId(user: number) {
    return await this.apiRepository.findOne({ where: { id: user } })
  }
  async getOne(where) {
    return await this.apiRepository.findOne({ where })
  }
  async createOne(id: number, body: any) {
    const user = await this.userRepository.findOne({ where: { id } })
    const oldApi = await this.getOne({ user: user.id, exchange: body.exchange })
    if (oldApi) throw new BadRequestException('invalid')
    const apiSetting = {
      apiKey: body.apiKey,
      secretKey: body.secretKey,
      exchange: body.exchange,
      user,
    } as ApiSetting
    const newApi = await this.apiRepository.create(apiSetting)
    return await this.apiRepository.save(newApi)
  }
  async updateOne(id: number, body: any) {
    await this.apiRepository.update({ id }, { ...body })
    return await this.apiRepository.findOne({ where: { id } })
  }
}
