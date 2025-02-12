import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from 'libs/entities';
import { GrpcUsecases } from '../app/usecases/grpc.usecase';
import { GoogleUser } from '../dto/auth.dto';

@Controller()
export class GrpcController {
  constructor(private readonly grpcUsecase: GrpcUsecases) {}

  @GrpcMethod('AuthService', 'GetUser')
  async getUser(body: { id: string }): Promise<User> {
    return await this.grpcUsecase.getUserData(body.id);
  }

  @GrpcMethod('AuthService', 'ValidateOrCreateGoogleUser')
  async validateOrCreateGoogleUser(body: GoogleUser) {
    return await this.grpcUsecase.validateOrCreateGoogleUser(body);
  }

  @GrpcMethod('AuthService', 'GetUsers')
  async getUsers(body: { ids: string[] }) {
    return await this.grpcUsecase.getUsers(body.ids);
  }
}
