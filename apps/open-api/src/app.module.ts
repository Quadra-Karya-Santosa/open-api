import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreDB } from './_db/core.db';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthHelper, JwtAuthGuardUser, UserJwtStrategy } from 'auth/auth';
import { ArticleRepository } from './repository/article.repository';
import { ArticleUsecases } from './usecases/article.usecase';
import { Article, Chat } from 'libs/entities/open-api';
import { ChatUsecases } from './usecases/chat.usecase';
import { ChatRepository } from './repository/chat.repository';
import { AuthRepository } from './repository/auth.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'user', property: 'user' }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    TypeOrmModule.forRootAsync({ useClass: CoreDB }),
    TypeOrmModule.forFeature([Article, Chat]),
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
  controllers: [ArticleUsecases, ChatUsecases],
  providers: [
    ArticleRepository,
    ChatRepository,
    AuthRepository,
    UserJwtStrategy,
    JwtAuthGuardUser,
    UserAuthHelper,
  ],
  exports: [UserJwtStrategy],
})
export class OpenApiModule {}
