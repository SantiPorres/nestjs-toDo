import { UsersEntity } from "src/users/entities/users.entity";

export interface IPayloadToken {
    sub: string;
}

export interface IAuthBody {
    username: string;
    password: string;
}

export interface IAuthResponse {
    accessToken: string;
    user: UsersEntity;
}

export interface IAuthTokenResult {
    sub: string;
    iat: string;
    exp: string;
}

export interface IUseToken {
    sub: string;
    isExpired: boolean;
} 