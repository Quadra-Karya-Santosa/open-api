import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO, AuthenticationDTO } from '../../dto/auth.dto';
import { User } from 'libs/entities';
import { UserAuthHelper } from 'auth/auth';
import { RoleEnum } from 'libs/entities/enum/role';
import { AuthRepository } from '../repository/auth.repository';
import { UserRepository } from '../repository/user.respository';

@Injectable()
export class UserUsecases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelper: UserAuthHelper,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(
    body: RegisterDTO,
    ip: string,
    useragent: string,
  ): Promise<AuthenticationDTO> {
    const exist = await this.userRepository.getUserByEmail(body.email);
    if (exist) {
      throw new ConflictException('Email already registered');
    }
    const password = await this.authHelper.encodePassword(body.password);
    const user = new User({
      email: body.email,
      username: body.name,
      password,
      role: RoleEnum.user,
      ip: ip,
      useragent,
    });
    try {
      const data = await this.userRepository.insertUser(user);
      return {
        token: this.authHelper.generateToken(data),
        user: data,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when try to register',
      );
    }
  }

  async login(body: LoginDTO): Promise<AuthenticationDTO> {
    const user = await this.userRepository.getUserByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const isValid = await this.authHelper.isPasswordValid(
      user.password,
      body.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return {
      token: this.authHelper.generateToken(user),
      user,
    };
  }

  async getProfile(id: string) {
    return await this.authRepository.getDataUserById(id);
  }

  async generateTokenByEmail(email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);
    const jwt = this.authHelper.generateToken(user);
    return jwt;
  }

  async loginCookie(body: LoginDTO): Promise<string> {
    const user = await this.userRepository.getUserByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const isValid = await this.authHelper.isPasswordValid(
      user.password,
      body.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const token = this.authHelper.generateToken(user);

    return token;
  }
}
