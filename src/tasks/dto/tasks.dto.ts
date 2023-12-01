import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { TASKS_STATUS } from "src/constants/TASKS_STATUS";
import { UsersDTO } from "src/users/dto/users.dto";

export class TasksDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description: string;

    @IsNotEmpty()
    @IsEnum(TASKS_STATUS)
    status: TASKS_STATUS;

    @IsOptional()
    user: UsersDTO;
}