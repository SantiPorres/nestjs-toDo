import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersDTO } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { Request } from 'express';
import { UpdateUsersDTO } from '../dto/update-users.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersServices: UsersService
    ) {}

    @Post()
    public async registerUser(
        @Body() body: UsersDTO
    ) {
        return await this.usersServices.registerUser(body);
    }

    @Get(':userId')
    @UseGuards(AuthGuard)
    public async getUserById(
        @Param('userId') userId: string
    ) {
        return await this.usersServices.getUserById(userId);
    }

    @Patch()
    @UseGuards(AuthGuard)
    public async updateUser(
        @Req() request: Request, 
        @Body() body: UpdateUsersDTO
    ) {
        return await this.usersServices.updateUserByToken(request, body);
    }

    @Delete()
    @UseGuards(AuthGuard)
    public async deleteUserByToken(
        @Req() request: Request
    ) {
        return await this.usersServices.deleteUserByToken(request);
    }

    @Delete(':userId')
    @UseGuards(AuthGuard)
    // technical debt
    public async deleteUserById(
        @Param('userId') userId: string
    ) {
        return await this.usersServices.deleteUserById(userId);
    }
}
