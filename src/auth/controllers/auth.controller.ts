import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDTO } from '../dto/auth.dto';
import { UsersEntity } from 'src/users/entities/users.entity';
import { ErrorManager } from 'src/utils/error.manager';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    async login(@Body() { username, password }: AuthDTO) {
        const userValidate: UsersEntity = await this.authService.validateUser(
            username,
            password
        )

        if (!userValidate) {
            throw new ErrorManager({
                type: 'UNAUTHORIZED',
                message: 'Invalid credentials'
            });
        }

        const jwt = await this.authService.generateJWT(userValidate);

        return jwt;
    }
}
    