import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { User } from 'src/schemas/user.entity'
import { RegisterDto } from './dtos'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(body: RegisterDto): Promise<User> {
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

  async register(user: RegisterDto) {
    const newUser = await this.create({
      email: user.email,
      password: user.password,
    })
    const { id, ...rest } = newUser
    const payload = { sub: id }

    return {
      user: newUser,
      accessToken: this.jwtService.sign(payload),
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ email })
      .addSelect('user.password')
      .getOne()
      
    if (user && (await compare(pass, user.password))) {
      const { password, ...rest } = user
      return rest
    }
    return null
  }

  login(user: User) {
    const { id, ...rest } = user
    const payload = { sub: id }

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    }
  }

  async getOne(id) {
    const data = await this.userRepository.findOne({ where: { id } })
    if (!data) throw new NotFoundException('User does not exists')
    return { message: 'Is a user', data }
  }
}
