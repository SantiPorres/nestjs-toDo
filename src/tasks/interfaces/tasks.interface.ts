import { UsersEntity } from "src/users/entities/users.entity";

export interface ITask {
    taskId: string;
    title: string;
    description?: string;
    status: string;
    user: UsersEntity;
}