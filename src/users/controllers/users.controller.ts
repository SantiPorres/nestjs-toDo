import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UsersDTO } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { UpdateUsersDTO } from '../dto/update-users.dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersServices: UsersService
    ) {}

    @Post()
    public async getTasks(@Body() body: UsersDTO) {
        return await this.usersServices.registerUser(body);
    }

    @Get(':userId')
    public async getUserById(@Param('userId') userId: string) {
        return await this.usersServices.getUserById(userId);
    }

    @Patch()
    public async updateUser(@Req() request: Request, @Body() body: UpdateUsersDTO) {
        return await this.usersServices.updateUserByToken(request, body);
    }

    @Delete()
    public async deleteUserByToken(@Req() request: Request) {
        return await this.usersServices.deleteUserByToken(request);
    }

    @Delete(':userId')
    public async deleteUserById(@Param('userId') userId: string) {
        return await this.usersServices.deleteUserById(userId);
    }
}
