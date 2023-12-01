import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersDTO } from '../dto/users.dto';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUsersDTO } from '../dto/update-users.dto';
import { manageTokenFromHeaders } from 'src/utils/token.manager';
import { Request } from 'express';
import { IUseToken } from 'src/auth/interfaces/auth.interface';
import { TasksService } from 'src/tasks/services/tasks.service';
import { IUsersService } from 'src/users/interfaces/users-service.interface';
import { ITasksService } from 'src/tasks/interfaces/tasks-service.interface';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class UsersService implements IUsersService{

    constructor(
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
        @Inject(forwardRef(() => TasksService)) private readonly tasksService: ITasksService
    ) {}

    public async registerUser(body: UsersDTO): Promise<UsersEntity> {
        try {
            body.password = await bcrypt.hash(
                body.password,
                +process.env.HASH_SALT
            );
            return await this.usersRepository.save(body)
        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async AuthGetUserBy({key, value}: {
        key: keyof UsersDTO;
        value: any;
    }): Promise<UsersEntity> {
        try {
            const user: UsersEntity = await this.usersRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where({ [key]: value })
                .getOne();

            return user;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }



    // Methods by Id

    public async getUserById(userId: string): Promise<UsersEntity> {
        try {
            const user: UsersEntity = await this.usersRepository
                .createQueryBuilder('user')
                .where({ userId })
                .leftJoinAndSelect('user.tasksIncludes', 'tasksIncludes')
                .getOne();
            
            if (!user) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: 'The user was not found'
                });
            }

            return user;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteUserById(userId: string): Promise<DeleteResult> {
        try {
            await this.getUserById(userId);

            await this.tasksService.deleteAllTasksByUserId(userId);

            const deleteResult: DeleteResult = await this.usersRepository.delete(
                userId
            );

            if (deleteResult.affected === 0) {
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'The user could not be deleted'
                });
            }
            
            return deleteResult;

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }



    // Methods by Token

    public async updateUserByToken(request: Request, body: UpdateUsersDTO): Promise<UsersEntity> {
        try {

            const managedToken: IUseToken = manageTokenFromHeaders(request);

            // sub refers to Subject => userId
            const tokenUserId = managedToken.sub;
            
            await this.getUserById(tokenUserId);

            const updateResult: UpdateResult = await this.usersRepository.update(
                tokenUserId, body
            )

            if (updateResult.affected === 0) {
                throw new ErrorManager({
                    type: 'NOT_MODIFIED',
                    message: 'The user could not be updated'
                });
            }

            return await this.getUserById(tokenUserId);
            
        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteUserByToken(request: Request): Promise<DeleteResult> {
        try {

            const managedToken: IUseToken = manageTokenFromHeaders(request);
            
            // sub refers to the Subject => userId
            const tokenUserId = managedToken.sub;
            
            await this.getUserById(tokenUserId);

            return await this.deleteUserById(tokenUserId);

        } catch(error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }
}
