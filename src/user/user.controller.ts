import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

    @Post()
    createOne(@Body() body:User) {
        return this.userService.create(body)
    }
    
    @Put()
    updateOne(@Body() body:User) {
        const { id } = body
        return this.userService.update(id, body)
    }
    
    @Delete(':ids')
    @ApiOperation({ summary: 'json array => "[1,2]"' })
    deleteMany(@Param('ids') ids:string) {
        const Ids = JSON.parse(ids)
        return this.userService.deleteMany(Ids)
    }
}
