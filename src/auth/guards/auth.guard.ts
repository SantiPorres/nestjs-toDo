import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/services/users.service';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../interfaces/auth.interface';
import { manageTokenFromHeaders } from 'src/utils/manage.token';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly userService: UsersService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    
    const req = context.switchToHttp().getRequest<Request>()

    const managedToken: IUseToken = manageTokenFromHeaders(req)

    // sub refers to Subject => userId
    const tokenUserId = managedToken.sub

    const user = await this.userService.getUserById(tokenUserId);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    req.userId = user.userId;

    return true;
  }
}
