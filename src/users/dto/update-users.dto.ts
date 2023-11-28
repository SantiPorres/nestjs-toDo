import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUsersDTO {

    @IsOptional()
    @IsString()
    @MaxLength(50)
    username: string;

    @IsOptional()
    @IsString()
    @MaxLength(120)
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(15)
    phoneNumber: string;

    password: string;

    userId: string;
}