import { BadRequestException, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksDTO } from '../dto/tasks.dto';
import { TasksEntity } from '../entities/tasks.entity';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { UsersEntity } from 'src/users/entities/users.entity';
import { TASKS_STATUS } from 'src/constants/TASKS_STATUS';
import { updateTaskStatusDTO } from '../dto/update-task-status.dto';
import { IUseToken } from 'src/auth/interfaces/auth.interface';
import { manageTokenFromHeaders } from 'src/utils/manage.token';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksEntity) private readonly tasksRepository: Repository<TasksEntity>,
        private readonly usersService: UsersService
    ) {}



    // Methods by Id

    public async getAllTasksByUserId(userId: string): Promise<TasksEntity[]> {
        const user: UsersEntity = await this.usersService.getUserById(userId);

        const tasks: TasksEntity[] = await this.tasksRepository
            .findBy({
                user
            })

        return tasks;
    }

    public async getTaskById(taskId: string): Promise<TasksEntity> {
        try {
            const task = this.tasksRepository.findOneBy({
                taskId
            })

            if (task) {
                return task
            }

            throw new NotFoundException();

        } catch(error) {
            throw new NotFoundException();
        }
        
    }

    public async updateTaskStatusById(taskId: string, body: updateTaskStatusDTO): Promise<UpdateResult> {
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
            throw new BadRequestException();
        }

    }

    public async deleteTaskById(taskId: string): Promise<DeleteResult> {
        try {
            const task: TasksEntity = await this.getTaskById(taskId);

            const deleteResult: DeleteResult = await this.tasksRepository.delete(
                task.taskId
            )

            if (deleteResult.affected !== 0) {
                return deleteResult;
            }

            throw new BadRequestException();

        } catch(error) {
            throw new BadRequestException();
        }
    }



    // Methods by Token

    public async getAllTasksByUserToken(
        request: Request
    ) : Promise<TasksEntity[]> {
        try {
            
            const managedToken: IUseToken = manageTokenFromHeaders(request);
            
            // sub refers to Subject => userId
            const tokenUserId = managedToken.sub
            
            const tasks: TasksEntity[] = await this.getAllTasksByUserId(tokenUserId)

            if (tasks.length === 0) {
                throw new NotFoundException()
            }

            return tasks;

        } catch(error) {
            console.log(error)
        }
    }

    public async createTaskByUserToken(body: TasksDTO, request: Request): Promise<TasksEntity> {

        try {

            const managedToken: IUseToken = manageTokenFromHeaders(request);
            
            // sub refers to Subject => userId
            const tokenUserId = managedToken.sub

            const user = await this.usersService.getUserById(tokenUserId);

            return await this.tasksRepository.save({
                ...body,
                user
            })

        } catch(error) {
            throw new BadRequestException();
        }
    }
}
