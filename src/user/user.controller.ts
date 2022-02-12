import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { User } from './user.entity';
import { UserService } from './user.service';
@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    getMany() {
        return this.userService.getMany()
    }

    @Get(':id')
    getOne(@Param('id') id:number) {
        return this.userService.getOne(id)
    }

    @Post('')
    createOne(@Body() body:User) {
        return this.userService.createOne(body)
    }
    
    @Put('')
    updateOne(@Body() body:User) {
        const { id } = body
        return this.userService.updateOne(id, body)
    }
    
    @Delete('')
    deleteMany(@Body() ids:number[]) {
        return this.userService.deleteMany(ids)
    }
}
