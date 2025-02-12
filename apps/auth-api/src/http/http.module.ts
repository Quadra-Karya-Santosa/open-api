import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GrpcController } from './grpc.controller';
import { UserController } from './user.controller';
import { GrpcUsecases } from '../app/usecases/grpc.usecase';
import { UserUsecases } from '../app/usecases/user.usecase';
import { JwtAuthGuardUser, UserAuthHelper, UserJwtStrategy } from 'auth/auth';
import { GoogleStrategy } from 'auth/auth/user/google.strategy';
import { RepositoryModule } from '../repository/repository.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'user', property: 'user' }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    RepositoryModule,
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
  controllers: [GrpcController, UserController],
  providers: [
    UserUsecases,
    GrpcUsecases,
    JwtAuthGuardUser,
    UserAuthHelper,
    GoogleStrategy,
    UserJwtStrategy,
    Logger,
  ],
  exports: [],
})
export class HttpModule {}
