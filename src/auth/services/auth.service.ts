import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersEntity } from 'src/users/entities/users.entity';
import { IAuthResponse, IPayloadToken } from '../interfaces/auth.interface';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService
    ) { }

    public async validateUser(username: string | number, password: string) {
        const userByUsername = await this.usersService.AuthGetUserBy({
            key: 'username',
            value: username
        });

        const userByEmail = await this.usersService.AuthGetUserBy({
            key: 'email',
            value: username
        });

        if (userByUsername) {
            const match = await bcrypt.compare(password, userByUsername.password);
            if (match) return userByUsername;
        }

        if (userByEmail) {
            const match = await bcrypt.compare(password, userByEmail.password);
            if (match) return userByEmail;
        }

        throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: 'The credentials are incorrect'
        });
    }

    public signJWT({
        payload,
        secret,
        expires
    }: {
        payload: jwt.JwtPayload;
        secret: string;
        expires: number | string;
    }) {
        return jwt.sign(payload, secret, { expiresIn: expires })
    }

    public async generateJWT(user: UsersEntity): Promise<IAuthResponse> {
        const payload: IPayloadToken = {
            sub: user.userId
        }

        return {
            accessToken: this.signJWT({
                payload,
                secret: process.env.JWT_SECRET,
                expires: '1h'
            }),
            user
        }
    }

}
