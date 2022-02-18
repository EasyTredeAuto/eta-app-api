import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dtos';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { User } from './user.entity';

export interface UserFindOne {
    id?:number
    email?:string
}

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
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
            .addSelect('user.binance_api')
            .addSelect('user.binance_secret_api')
            .getOne()
    }
    async getMany() {
        const data = await this.userRepository.find()
        return {message: "Is all user", data }
    }
    async getOne(id) {
        const data = await this.userRepository.findOne({where: {id}})
        if (!data) throw new NotFoundException('User does not exists')
        return {message: "Is a user", data }
    }
    async create(body:CreateUserDto) {
        const userExist = await this.userRepository.findOne({where: {email:body.email}})
        if (userExist) throw new BadRequestException('User already registered with email')
        const newUser =  await this.userRepository.create(body)
        if (!newUser.roles) newUser.roles = ["AUTHOR"]
        const data = await this.userRepository.save(newUser) as User
        delete data.password
        return {message: "User created", data }
    }
    async register(body:RegisterDto): Promise<User> {
        const userExist = await this.userRepository.findOne({where: {email:body.email}})
        if (userExist) throw new BadRequestException('User already registered with email')
        const newUser =  await this.userRepository.create(body)
        newUser.roles = ["AUTHOR"]
        const data = await this.userRepository.save(newUser)
        delete data.password
        delete data.binance_secret_api
        delete data.binance_api
        delete data.deletedAt
        delete data.active
        return data
    }
    async update(id:number, body:EditUserDto) {
        const user = await this.userRepository.findOne({where: {id: body.id}})
        if (!user) throw new BadRequestException('User does not exist')
        const editedUser = Object.assign(user, body)
        await this.userRepository.save(editedUser)
        delete editedUser.password
        return {message: "User updated", data: editedUser }
    }
    async deleteMany(ids) {
        await this.userRepository.delete(ids)
        const data = await this.userRepository.find()
        return {message: "User deleted", data }
    }
}
