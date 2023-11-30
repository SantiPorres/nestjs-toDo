import { UpdateUsersDTO } from "src/users/dto/update-users.dto";
import { UsersDTO } from "src/users/dto/users.dto";
import { UsersEntity } from "src/users/entities/users.entity";
import { Request } from 'express';
import { DeleteResult } from "typeorm";

export interface IUsersService {
    registerUser(body: UsersDTO): Promise<UsersEntity>;

    AuthGetUserBy({key, value}: {
        key: keyof UsersDTO;
        value: any;
    }): Promise<UsersEntity>;

    getUserById(userId: string): Promise<UsersEntity>;

    deleteUserById(userId: string): Promise<DeleteResult>;

    updateUserByToken(request: Request, body: UpdateUsersDTO): Promise<UsersEntity>;

    deleteUserByToken(request: Request): Promise<DeleteResult>;
}