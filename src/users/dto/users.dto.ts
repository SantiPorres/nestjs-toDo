import { IsNotEmpty, IsOptional, IsString, MaxLength, IsPhoneNumber } from "class-validator";

export class UsersDTO {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(120)
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    @MaxLength(15)
    phoneNumber: string;
}