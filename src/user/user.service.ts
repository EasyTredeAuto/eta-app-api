import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from 'src/auth/dtos'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { EditUserDto } from './dtos/edit-user.dto'
import { User } from '../schemas/user.entity'
import { ApiSetting } from 'src/schemas/user-secret-api.entity'

export interface UserFindOne {
  id?: number
  email?: string
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ApiSetting)
    private apiRepository: Repository<ApiSetting>,
  ) {}

  async findOne(data: UserFindOne) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password')
      .getOne()
  }
  async findSecret(data: UserFindOne) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .getOne()
  }
  async getMany(page, size, search) {
    const [resultUser, count] = await this.userRepository.findAndCount({
      where: { email: Like(`%${search}%`) },
      order: { createdAt: 'DESC' },
      take: size,
      skip: page * size,
    })
    const resultApi = await this.apiRepository.find()
    const users = JSON.parse(JSON.stringify(resultUser))
    const apis = JSON.parse(JSON.stringify(resultApi))
    for (const user of users) {
      const isApi = apis.find((x) => x.userIds === user.id)
      user.apiActive = isApi ? true : false
    }
    return { message: 'Is all user', data: users, count }
  }
  async getOne(id) {
    const data = await this.userRepository.findOne({ where: { id } })
    if (!data) throw new NotFoundException('User does not exists')
    return { message: 'Is a user', data }
  }
  async create(body: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: body.email },
    })
    if (userExist)
      throw new BadRequestException('User already registered with email')
    const user = {
      email: body.email,
      password: body.password,
      roles: body.roles,
    } as User
    const newUser = await this.userRepository.create(user)
    const data = await this.userRepository.save(newUser)
    delete data.password
    return { message: 'User created', data }
  }
  async register(body: RegisterDto): Promise<User> {
    const userExist = await this.userRepository.findOne({
      where: { email: body.email },
    })
    if (userExist)
      throw new BadRequestException('User already registered with email')
    const newUser = await this.userRepository.create(body)
    const data = await this.userRepository.save(newUser)
    delete data.password
    delete data.deletedAt
    delete data.active
    return data
  }
  async update(id: number, body: EditUserDto) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new BadRequestException('User does not exist')
    const editedUser = Object.assign(user, body)
    await this.userRepository.save(editedUser)
    delete editedUser.password
    return { message: 'User updated', data: editedUser }
  }
  async deleteMany(ids) {
    await this.userRepository.delete(ids)
    const data = await this.userRepository.find()
    return { message: 'User deleted', data }
  }
}
