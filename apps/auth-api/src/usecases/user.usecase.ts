import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDTO, RegisterDTO, AuthenticationDTO } from '../dto/auth.dto';
import { User } from 'libs/entities';
import { UserAuthHelper } from 'auth/auth';
import { RoleEnum } from 'libs/entities/enum/role';
import { AuthRepository } from '../repository/auth.repository';
import { Request } from 'express';

@ApiTags('User')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserUsecases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelper: UserAuthHelper,
    private readonly authRepository: AuthRepository,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Successfully register.',
    type: AuthenticationDTO,
  })
  @ApiConflictResponse({
    description: 'Email already registered',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when register, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @Post('/register')
  async register(
    @Body() body: RegisterDTO,
    @Req() req: Request,
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
      ip: req.ip,
      useragent: req.headers['user-agent'],
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

  @ApiResponse({
    status: 201,
    description: 'Login Success',
    type: AuthenticationDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Incorrect email or password',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when register, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @Post('/login')
  async login(@Body() body: LoginDTO): Promise<AuthenticationDTO> {
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

  @Get('/profile/:id')
  async getProfile(@Param('id') id: string) {
    return await this.authRepository.getDataUser(id);
  }
}
