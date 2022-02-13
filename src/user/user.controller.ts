import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ACGuard, InjectRolesBuilder, RolesBuilder, UseRoles, UserRoles } from 'nest-access-control';
import { AppResources } from 'src/app.roles';
import { Auth } from 'src/common/decorators';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder 
    ) {}

    @Get()
    getMany() {
        return this.userService.getMany()
    }

    @Get(':id')
    getOne(@Param('id') id:number) {
        return this.userService.getOne(id)
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.USER
    })
    @Post()
    async createOne(@Body() body:CreateUserDto) {
        return await this.userService.create(body)
    }
    
    @Auth()
    @Put()
    updateOne(@Body() user:EditUserDto) {
        return this.userService.update(user)
    }
    
    @Auth()
    @Delete(':ids')
    @ApiOperation({ summary: 'json array => "[1,2]"' })
    deleteMany(@Param('ids') ids:string) {
        const Ids = JSON.parse(ids)
        return this.userService.deleteMany(Ids)
    }
}
