import { IsEnum, IsNotEmpty, } from "class-validator";
import { TASKS_STATUS } from "src/constants/TASKS_STATUS";

export class updateTaskStatusDTO {
    @IsNotEmpty()
    @IsEnum(TASKS_STATUS)
    status: TASKS_STATUS;
}