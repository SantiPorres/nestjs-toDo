import { BadRequestException, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksDTO } from '../dto/tasks.dto';
import { TasksEntity } from '../entities/tasks.entity';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { IUseToken } from 'src/auth/interfaces/auth.interface';
import { useToken } from 'src/utils/use.token';
import { UsersEntity } from 'src/users/entities/users.entity';
import * as jwt from 'jsonwebtoken';

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
}
