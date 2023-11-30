import { Exclude } from "class-transformer";
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TasksEntity } from "../../tasks/entities/tasks.entity";
import { IUser } from "../../interfaces/users/users.interface";

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {

    @PrimaryGeneratedColumn('uuid')
    userId: string;
    
    @Column({ unique: true })
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ 
        unique: true,
        nullable: true,
        default: null
     })
    phoneNumber?: string;

    @OneToMany(
        ()=> TasksEntity,
        (tasks)=> tasks.user
    )
    tasksIncludes: TasksEntity[];
}