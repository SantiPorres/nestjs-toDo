import { UnauthorizedException } from "@nestjs/common";
import { useToken } from "./use.token";
import { IUseToken } from "src/auth/interfaces/auth.interface";
import { Request } from 'express';

export const manageTokenFromHeaders = (request: Request): IUseToken => {
    const token = request.headers['api_token'];

    if (!token || Array.isArray(token) || typeof token !== 'string') {
        throw new UnauthorizedException('Invalid token');
    }

    const managedToken: IUseToken | string = useToken(token);

    if (typeof managedToken === 'string') {
        throw new UnauthorizedException(managedToken);
    }

    if (managedToken.isExpired) {
        throw new UnauthorizedException('Token expired');
    }

    return managedToken;
}