import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDTO, RegisterDTO, AuthenticationDTO } from '../dto/auth.dto';
import { User } from 'libs/entities';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserUsecases } from '../app/usecases/user.usecase';

@ApiTags('User')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/user')
export class UserController {
  constructor(private readonly userUsecase: UserUsecases) {}

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
    return await this.userUsecase.register(
      body,
      req.ip,
      req.headers['user-agent'],
    );
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
      'Error occured when login, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @Post('/login')
  async login(@Body() body: LoginDTO): Promise<AuthenticationDTO> {
    return await this.userUsecase.login(body);
  }

  @Get('/profile')
  @UseGuards(AuthGuard('user'))
  async getProfile(@Req() req: any) {
    const user: User = req.user;
    return await this.userUsecase.getProfile(user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const jwt = await this.userUsecase.generateTokenByEmail(req.user.email);
    res.redirect(`http://localhost:3000/dashboard?token=${jwt}`);
  }

  @ApiExcludeEndpoint()
  @ApiResponse({
    status: 201,
    description: 'Login Success',
  })
  @ApiUnauthorizedResponse({
    description: 'Incorrect email or password',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when login, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @Post('/cookie/login')
  async loginCookie(
    @Body() body: LoginDTO,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const token = await this.userUsecase.loginCookie(body);

    const origin = req.headers.origin;
    const isLocalhost =
      origin.includes('localhost') || origin.includes('127.0.0.1');

    res.cookie('token', token, {
      httpOnly: false,
      secure: !isLocalhost,
      sameSite: 'none',
      ...(isLocalhost ? {} : { domain: process.env.DOMAIN }),
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({ success: true });
  }
}
