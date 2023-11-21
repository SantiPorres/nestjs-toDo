import { IsNotEmpty, IsString } from "class-validator";
import { IAuthBody } from "../interfaces/auth.interface";

export class AuthDTO implements IAuthBody {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}