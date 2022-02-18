import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './bot.entity';
import { CreateBotDto } from './dtos/create-bot.dto';
import { UpdateBotDto } from './dtos/update-bot.dto';

@Injectable()
export class BinanceBotService {

    constructor(
        @InjectRepository(Bot)
        private botRepository: Repository<Bot>
    ){}
    async findAll(id) {
        const data = await this.botRepository.find({where: {id}})
        return {message: "this is your all bots", data }
    }
    async create(body:CreateBotDto) {
        const botExist = await this.botRepository.findOne({where: {name: body.name, userId: body.userId}})
        if (botExist) throw new BadRequestException('Bot already registered with name')
        const newBot =  await this.botRepository.create(body)
        const data = await this.botRepository.save(newBot) as Bot
        return {message: "Bot created", data }
    }
    async update(id:number, body:UpdateBotDto) {
        const bot = await this.botRepository.findOne({where: {id}})
        if (!bot) throw new BadRequestException('Bot does not exist')
        const editedBot = Object.assign(bot, body)
        await this.botRepository.save(editedBot)
        return {message: "Bot updated", data: editedBot }
    }
    async delete(ids:number[]|number) {
        const bot = await this.botRepository.softDelete(ids)
        const data = await this.botRepository.find()
        return {message: "Bot deleted", data }
    }
}
