import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
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
import { manageTokenFromHeaders } from 'src/utils/token.manager';
import { ITasksService } from 'src/interfaces/tasks/tasks-service.interface';
import { IUsersService } from 'src/interfaces/users/users-service.interface';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class TasksService implements ITasksService {

    constructor(
        @InjectRepository(TasksEntity) private readonly tasksRepository: Repository<TasksEntity>,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: IUsersService
    ) {}



    // Methods by Id

    public async getAllTasksByUserId(userId: string): Promise<TasksEntity[]> {

        try {
            const user: UsersEntity = await this.usersService.getUserById(userId);
    
            const tasks: TasksEntity[] = await this.tasksRepository
                .findBy({
                    user
                });
    
            return tasks;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async getTaskById(taskId: string): Promise<TasksEntity> {
        try {
            const task = await this.tasksRepository.findOneBy({
                taskId
            });

            if (!task) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: 'The task was not found'
                });
            }
            
            return task;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
        
    }

    public async updateTaskStatusById(taskId: string, body: updateTaskStatusDTO): Promise<UpdateResult> {
        try {
            const task: TasksEntity = await this.getTaskById(taskId);
            
            if (body.status !== task.status) {
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'The current status of the task does not match with the db'
                });
            }

            if (body.status === TASKS_STATUS.PENDING) {
                task.status = TASKS_STATUS.DONE;
            } else if (body.status === TASKS_STATUS.DONE){
                task.status = TASKS_STATUS.PENDING;
            }
            const updatedTask: UpdateResult = await this.tasksRepository.update(
                taskId, task
            );

            if (updatedTask.affected === 0) {
                throw new ErrorManager({
                    type: 'NOT_MODIFIED',
                    message: 'The task status could not be updated'
                });
            }

            return updatedTask;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }

    }

    public async deleteTaskById(taskId: string): Promise<DeleteResult> {
        try {
            await this.getTaskById(taskId);

            const deleteResult: DeleteResult = await this.tasksRepository.delete(
                taskId
            );

            if (deleteResult.affected === 0) {
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'The task could not be deleted'
                });
            }
            
            return deleteResult;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteAllTasksByUserId(userId: string): Promise<DeleteResult | void> {
        try {

            if ((await this.getAllTasksByUserId(userId)).length === 0) {
                return;
            }

            const deleteResult: DeleteResult = await this.tasksRepository.createQueryBuilder('tasks')
                .delete()
                .where('user.userId = :userId', {userId})
                .execute();

            if (deleteResult.affected === 0) {
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'The user tasks could not be deleted'
                });
            }
            
            return deleteResult;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }



    // Methods by Token

    public async getAllTasksByUserToken(
        request: Request
    ) : Promise<TasksEntity[]> {
        try {
            
            const managedToken: IUseToken = manageTokenFromHeaders(request);
            
            // sub refers to Subject => userId
            const tokenUserId = managedToken.sub;
            
            const tasks: TasksEntity[] = await this.getAllTasksByUserId(tokenUserId);

            return tasks;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
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
            throw ErrorManager.createSignatureError(error.message);
        }
    }
}
