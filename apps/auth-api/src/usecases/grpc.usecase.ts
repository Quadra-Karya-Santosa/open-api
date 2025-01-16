import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { User } from 'libs/entities';
import { UserRepository } from '../repository/user.repository';

@Controller()
export class GrpcUsecases {
  @Inject(UserRepository)
  private readonly service: UserRepository;

  @GrpcMethod('AuthService', 'GetUser')
  async getUser(body: { id: string }): Promise<User> {
    try {
      const user = await this.service.getUserById(body.id);
      if (!user) {
        throw new RpcException('User not Found');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new RpcException('Repository error');
    }
  }
}
