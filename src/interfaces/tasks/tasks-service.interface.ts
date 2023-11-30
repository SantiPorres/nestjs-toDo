import { updateTaskStatusDTO } from "src/tasks/dto/update-task-status.dto";
import { TasksEntity } from "src/tasks/entities/tasks.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { Request } from 'express';
import { TasksDTO } from "src/tasks/dto/tasks.dto";

export interface ITasksService {
    getAllTasksByUserId(userId: string): Promise<TasksEntity[]>;

    getTaskById(taskId: string): Promise<TasksEntity>;

    updateTaskStatusById(taskId: string, body: updateTaskStatusDTO): Promise<UpdateResult>;

    deleteTaskById(taskId: string): Promise<DeleteResult>;

    deleteAllTasksByUserId(userId: string): Promise<DeleteResult | void>;

    getAllTasksByUserToken(request: Request) : Promise<TasksEntity[]>;

    createTaskByUserToken(body: TasksDTO, request: Request): Promise<TasksEntity>;
}