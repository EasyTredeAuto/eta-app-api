import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppRoles } from 'src/app.roles';
import { Auth } from 'src/common/decorators';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    @Auth()
    @Get()
    async getMany(
        @Request() request
    ) {
        const { roles } = request.user.data
        if (roles !== AppRoles.ADMIN) throw new BadRequestException('Forbidden resource')
        return this.userService.getMany()
    }

    @Auth()
    @Post()
    async createOne(
        @Body() body:CreateUserDto,
        @Request() request
    ) {
        const { roles } = request.user.data
        if (roles !== AppRoles.ADMIN) throw new BadRequestException('Forbidden resource')
        return await this.userService.create(body)
    }
    
    @Auth()
    @Put()
    async updateOne(
        @Body() dto:EditUserDto,
        @Request() request
    ) {
        const { id } = request.user.data
        let data = await this.userService.update(id, dto)
        return { message: 'User updated', data }
    }
    
    @Auth()
    @Delete(':ids')
    @ApiOperation({ summary: 'json array => "[1,2]"' })
    async deleteMany(
        @Param('ids') ids:string,
        @Request() request
    ) {
        const { roles } = request.user.data
        if (roles !== AppRoles.ADMIN) throw new BadRequestException('Forbidden resource')
        const Ids = JSON.parse(ids)
        return this.userService.deleteMany(Ids)
    }
}
