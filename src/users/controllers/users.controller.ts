import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersDTO } from '../dto/users.dto';
import { UsersService } from '../services/users.service';

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
}
