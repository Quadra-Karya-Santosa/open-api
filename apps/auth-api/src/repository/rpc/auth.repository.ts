import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from 'libs/entities/grpc-interfaces/auth-grpc.interface';
import { AuthRepository } from '../../app/repository/auth.repository';

export class AuthGRPCRepository extends AuthRepository implements OnModuleInit {
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {
    super();
  }

  async getDataUserById(id: string) {
    return this.authService.getUser({ id }).toPromise();
  }
}
