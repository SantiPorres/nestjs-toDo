import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { TASKS_STATUS } from "../../constants/TASKS_STATUS";
import { UsersEntity } from "../../users/entities/users.entity";
import { ITask } from "../interfaces/tasks.interface";

@Entity({ name: 'tasks' })
export class TasksEntity extends BaseEntity implements ITask {

    @PrimaryGeneratedColumn('uuid')
    taskId: string;

    @Column()
    title: string;

    @Column()
    description?: string;

    @Column({
        type: 'enum',
        enum: TASKS_STATUS
    })
    status: TASKS_STATUS;

    @ManyToOne(
        () => UsersEntity,
        (user) => user.tasksIncludes
    )
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;
}