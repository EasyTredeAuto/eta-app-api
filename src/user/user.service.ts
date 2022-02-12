import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async getMany():Promise<User[]> {
        const result = await this.userRepository.find()
        return result
    }
    async getOne(id):Promise<User> {
        return await this.userRepository.findOne({where: {id}})
    }
    async create(body:User):Promise<User> {
        const newUser =  await this.userRepository.create(body)
        return await this.userRepository.save(newUser)
    }
    async update(id, body):Promise<User> {
        await this.userRepository.update({id}, body)
        return await this.userRepository.findOne({where: {id}})
    }
    async deleteMany(ids):Promise<User[]> {
        await this.userRepository.delete(ids)
        return await this.userRepository.find()
    }
}
