import { Module } from '@nestjs/common';
import { UserUsecases } from './usecases/user.usecase';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreDB } from './_db/core.db';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthHelper, JwtAuthGuardUser, UserJwtStrategy } from 'auth/auth';
import { GrpcUsecases } from './usecases/grpc.usecase';
import { User } from 'libs/entities';
import { AuthRepository } from './repository/auth.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'user', property: 'user' }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    TypeOrmModule.forRootAsync({ useClass: CoreDB }),
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: './contract/auth.proto',
          url: process.env.AUTH_SERVICE,
        },
      },
    ]),
  ],
  controllers: [UserUsecases, GrpcUsecases],
  providers: [
    UserRepository,
    AuthRepository,
    UserJwtStrategy,
    JwtAuthGuardUser,
    UserAuthHelper,
  ],
  exports: [UserJwtStrategy],
})
export class AuthApiModule {}
