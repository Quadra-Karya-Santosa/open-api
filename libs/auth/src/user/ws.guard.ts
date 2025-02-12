import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import cookie from 'cookie';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      if (context.getType() !== 'ws') {
        return false;
      }

      const client: Socket = context.switchToWs().getClient();
      const tokenHeader = this.extractTokenFromHeader(client);
      const tokenAuth = this.extractTokenFromAuth(client);
      const token = tokenHeader ?? tokenAuth;

      if (!token) {
        return false;
      }
      const payload = this.jwtService.verify(token);
      (client as any).user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromAuth(client: Socket): string | undefined {
    const [type, token] = client.handshake.auth.Authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
