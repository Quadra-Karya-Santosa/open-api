import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from 'libs/entities';
import { GoogleUser } from '../../dto/auth.dto';
import { RoleEnum } from 'libs/entities/enum/role';
import { UserRepository } from '../repository/user.respository';

@Controller()
export class GrpcUsecases {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserData(id: string): Promise<User> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new RpcException('User not Found');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new RpcException('Repository error');
    }
  }

  async validateOrCreateGoogleUser(body: GoogleUser) {
    let user = await this.userRepository.getUserByEmail(body.email);
    if (!user) {
      const newUser = new User({
        email: body.email,
        username: `${body.firstName} ${body.lastName}`,
        googleId: body.accessToken,
        role: RoleEnum.user,
      });
      user = await this.userRepository.insertUser(newUser);
    }
    return user;
  }

  async getUsers(ids: string[]) {
    const users = await this.userRepository.getUserByIds(ids);
    return { users };
  }
}
