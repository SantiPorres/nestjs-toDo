import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { UsersDTO } from '../dto/users.dto';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUsersDTO } from '../dto/update-users.dto';
import { manageTokenFromHeaders } from 'src/utils/manage.token';
import { Request } from 'express';
import { IUseToken } from 'src/auth/interfaces/auth.interface';
import { TasksService } from 'src/tasks/services/tasks.service';
import { TasksEntity } from 'src/tasks/entities/tasks.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
        //@Inject(forwardRef(() => TasksService)) private readonly tasksService: TasksService
    ) {}

    public async registerUser(body: UsersDTO): Promise<UsersEntity> {
        try {
            body.password = await bcrypt.hash(
                body.password,
                +process.env.HASH_SALT
            );
            return await this.usersRepository.save(body)
        } catch(error) {
            throw new BadRequestException()
        }
    }



    public async getUserBy({
        key, value
    }: {
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
            throw new BadRequestException();
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
                throw new BadRequestException();
            }

            return user;

        } catch(error) {
            throw new NotFoundException();
        }
    }

    public async deleteUserById(userId: string) {
        try {
            // await this.tasksService.deleteAllTasksByUser(userId);

            const deleteResult: DeleteResult = await this.usersRepository.delete(
                userId
            );

            if (deleteResult.affected !== 0) {
                return deleteResult;
            }

            throw new BadRequestException();

        } catch(error) {
            throw new BadRequestException();
        }
    }



    // Methods by Token

    public async updateUserByToken(request: Request, body: UpdateUsersDTO) {
        try {

            const managedToken: IUseToken = manageTokenFromHeaders(request);

            // sub refers to Subject => userId
            const tokenUserId = managedToken.sub;
            
            const user: Promise<UsersEntity> = this.getUserById(tokenUserId);

            const updateResult: UpdateResult = await this.usersRepository.update(
                (await user).userId, body
            )

            if (updateResult.affected !== 0) {
                return await this.getUserById(tokenUserId);
            }

            throw new BadRequestException();
            
        } catch(error) {
            throw new BadRequestException();
        }
    }

    public async deleteUserByToken(request: Request) {
        try {

            const managedToken: IUseToken = manageTokenFromHeaders(request);
            
            // sub refers to the Subject => userId
            const tokenUserId = managedToken.sub;
            
            const user: UsersEntity = await this.getUserById(tokenUserId);

            return await this.deleteUserById(user.userId);

        } catch(error) {
            throw new NotFoundException();
        }
    }
}
