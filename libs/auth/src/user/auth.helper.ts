import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';
import { AuthServiceClient } from 'libs/entities/grpc-interfaces/auth-grpc.interface';
import { User } from 'libs/entities';

@Injectable()
export class UserAuthHelper implements OnModuleInit {
  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  private readonly jwt: JwtService;
  private readonly scryptAsync = promisify(scrypt);

  constructor(
    jwt: JwtService,
    @Inject('AUTH_PACKAGE') private client: ClientGrpc,
  ) {
    this.jwt = jwt;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<User> {
    try {
      return await this.authService.getUser({ id: decoded.id }).toPromise();
      // return decoded;
    } catch (error) {
      console.error(error);
    }
  }

  public generateResetPwToken = (email: string) => {
    return this.jwt.sign(
      { email },
      {
        expiresIn: '1d',
      },
    );
  };

  public verifyResetPwToken = (token: string) => {
    return this.jwt.verify<{ email: string; iat: number }>(token);
  };

  // Generate JWT Token
  public generateToken(user: User): string {
    return this.jwt.sign({ id: user.id, email: user.email });
  }

  // Validate User's password
  public async isPasswordValid(
    storedPassword: string,
    suppliedPassword: string,
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = await this.scryptAsync(suppliedPassword, salt, 64);

    return buf.toString() === hashedPassword;
  }

  // Encode User's password
  public async encodePassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const buf = await this.scryptAsync(password, salt, 64);

    return `${buf.toString()}.${salt}`;
  }

  // Generate OTP
  public generateOTP(): string {
    switch (process.env.NODE_ENV) {
      case 'test':
        return '0000';
      case 'development':
        return '0000';
      default:
        return `${this.randomNumber()}${this.randomNumber()}${this.randomNumber()}${this.randomNumber()}`;
    }
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 10);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);
    if (!decoded) {
      throw new UnauthorizedException();
    }

    const user = await this.validateUser(decoded);
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
