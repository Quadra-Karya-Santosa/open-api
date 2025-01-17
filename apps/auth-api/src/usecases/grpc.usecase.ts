import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { User } from 'libs/entities';
import { UserRepository } from '../repository/user.repository';
import { GoogleUser } from '../dto/auth.dto';
import { RoleEnum } from 'libs/entities/enum/role';

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

  @GrpcMethod('AuthService', 'ValidateOrCreateGoogleUser')
  async validateOrCreateGoogleUser(body: GoogleUser) {
    let user = await this.service.getUserByEmail(body.email);
    if (!user) {
      const newUser = new User({
        email: body.email,
        username: `${body.firstName} ${body.lastName}`,
        googleId: body.accessToken,
        role: RoleEnum.user,
      });
      user = await this.service.insertUser(newUser);
    }
    return user;
  }
}
