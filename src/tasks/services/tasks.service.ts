import { BadRequestException, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksDTO } from '../dto/tasks.dto';
import { TasksEntity } from '../entities/tasks.entity';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { UsersEntity } from 'src/users/entities/users.entity';
import * as jwt from 'jsonwebtoken';
import { TASKS_STATUS } from 'src/constants/TASKS_STATUS';
import { updateTaskStatusDTO } from '../dto/update-task-status.dto';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksEntity) private readonly tasksRepository: Repository<TasksEntity>,
        private readonly usersService: UsersService
    ) {}

    public async createTask(body: TasksDTO, request: Request): Promise<TasksEntity> {

        try {

            const token = request.headers['api_token']

            if (typeof token !== 'string') throw Error;

            const manageToken = jwt.decode(token);
            // sub is the userId
            if (typeof manageToken.sub !== 'string') throw Error;
            
            const user = await this.usersService.getUserById(manageToken.sub);

            return await this.tasksRepository.save({
                ...body,
                user
            })

        } catch(error) {
            throw new BadRequestException();
        }
    }

    public async getAllTasksByUserId(userId: string): Promise<TasksEntity[]> {
        const user: UsersEntity = await this.usersService.getUserById(userId);

        const tasks: TasksEntity[] = await this.tasksRepository
            .findBy({
                user
            })

        return tasks;
    }

    public async getAllTasksByUserToken(
        request: Request
    ) : Promise<TasksEntity[]> {
        try {
            
            const token = request.headers['api_token']

            if (typeof token !== 'string') throw Error;

            const manageToken = jwt.decode(token);
            // sub is the userId
            if (typeof manageToken.sub !== 'string') throw Error;
            
            const tasks: TasksEntity[] = await this.getAllTasksByUserId(manageToken.sub)

            if (tasks.length === 0) {
                throw new NotFoundException()
            }

            return tasks;

        } catch(error) {
            console.log(error)
        }
    }

    public async getTaskById(taskId: string): Promise<TasksEntity> {
        try {
            const task = this.tasksRepository.findOneBy({
                taskId
            })
            return task
        } catch(error) {
            throw new NotFoundException()
        }
        
    }

    public async updateTaskStatus(taskId: string, body: updateTaskStatusDTO): Promise<UpdateResult> {
        try {
            const task = await this.getTaskById(taskId)

            if (!task) {
                throw new BadRequestException();
            }
            
            if (body.status !== task.status) {
                throw new BadRequestException();
            }

            if (body.status === TASKS_STATUS.PENDING) {
                task.status = TASKS_STATUS.DONE;
            } else if (body.status === TASKS_STATUS.DONE){
                task.status = TASKS_STATUS.PENDING;
            }
            const updatedTask: UpdateResult = await this.tasksRepository.update(
                taskId, task
            )

            if (updatedTask.affected === 1) {
                return updatedTask;
            }
            throw new BadRequestException();
        } catch(error) {
            throw new BadRequestException()
        }

    }
}
