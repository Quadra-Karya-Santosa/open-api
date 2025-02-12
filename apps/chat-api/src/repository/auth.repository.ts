import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from 'libs/entities/grpc-interfaces/auth-grpc.interface';

export class AuthRepository implements OnModuleInit {
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  async getUsers(ids: string[]) {
    const { users } = await this.authService.getUsers({ ids }).toPromise();
    return users;
  }
}
