import { UsersEntity } from "src/users/entities/users.entity";
import * as jwt from 'jsonwebtoken';
import { IAuthResponse } from "./auth.interface";

export interface IAuthService {
    validateUser(username: string | number, password: string): Promise<UsersEntity>;

    signJWT({
        payload,
        secret,
        expires
    }: {
        payload: jwt.JwtPayload;
        secret: string;
        expires: number | string;
    }): string;

    generateJWT(user: UsersEntity): Promise<IAuthResponse>;
}