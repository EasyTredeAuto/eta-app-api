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

    async getMany() {
        const data = await this.userRepository.find()
        return {message: "Is all user", data }
    }
    async getOne(id) {
        const data = await this.userRepository.findOne({where: {id}})
        if (!data) throw new NotFoundException('User does not exists')
        return {message: "Is a user", data }
    }
    async create(body:User) {
        const newUser =  await this.userRepository.create(body)
        const data = await this.userRepository.save(newUser)
        return {message: "User created.", data }
    }
    async update(id, body) {
        await this.userRepository.update({id}, body)
        const data = await this.userRepository.findOne({where: {id}})
        return {message: "User updated.", data }
    }
    async deleteMany(ids) {
        await this.userRepository.delete(ids)
        const data = await this.userRepository.find()
        return {message: "User deleted.", data }
    }
}
