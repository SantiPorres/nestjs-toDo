import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TasksDTO } from '../dto/tasks.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(
        private readonly tasksServices: TasksService
    ) {}

    @Post()
    public async createTask(
        @Body() body: TasksDTO,
        @Req() request: Request
    ) {
        return await this.tasksServices.createTask(body, request);
    }

    @Get()
    public async getTasksByUserToken(@Req() request: Request) {
        return await this.tasksServices.getAllTasksByUserToken(request)
    }

}
