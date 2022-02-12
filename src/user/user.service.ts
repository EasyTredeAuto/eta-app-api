import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getMany():Promise<User[]> {
        const result = await this.userRepository.find()
        return result
    }

    async getOne(id):Promise<User> {
        return await this.userRepository.findOne({where: {id}})
    }

    async createOne(body):Promise<User[]> {
        if (!body) throw new NotFoundException('user is not valid')
        const result = await this.userRepository.create(body)
        console.log(result)
        return result
    }
    
    async updateOne(id, body):Promise<User> {
        await this.userRepository.update({id}, body)
        return await this.userRepository.findOne({where: {id}})
    }
    
    async deleteMany(ids):Promise<User[]> {
        await this.userRepository.delete({ id: ids })
        return await this.userRepository.find()
    }
}
