import { TasksEntity } from "src/tasks/entities/tasks.entity";

export interface IUser {
    userId: string;
    username: string;
    password: string;
    email: string;
    phoneNumber?: string;
    tasksIncludes: TasksEntity[];
}