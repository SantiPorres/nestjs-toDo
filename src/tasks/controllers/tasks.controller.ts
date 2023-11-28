import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TasksDTO } from '../dto/tasks.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { updateTaskStatusDTO } from '../dto/update-task-status.dto';

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
        return await this.tasksServices.createTaskByUserToken(body, request);
    }

    @Get()
    public async getTasksByUserToken(@Req() request: Request) {
        return await this.tasksServices.getAllTasksByUserToken(request)
    }

    @Patch(':taskId')
    public async updateTaskStatus(@Param('taskId') taskId: string, @Body() body: updateTaskStatusDTO ) {
        return await this.tasksServices.updateTaskStatusById(taskId, body)
    }

    @Delete(':taskId')
    public async deleteTask(@Param('taskId') taskId: string) {
        return await this.tasksServices.deleteTaskById(taskId);
    }

}
