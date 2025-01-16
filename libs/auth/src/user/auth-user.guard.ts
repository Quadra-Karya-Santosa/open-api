import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as Guard, IAuthGuard } from '@nestjs/passport';
import { User } from 'libs/entities';

@Injectable()
export class JwtAuthGuardUser extends Guard('user') implements IAuthGuard {
  public handleRequest(err: unknown, user: User): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user ? true : false;
  }
}
