import { Module } from '@nestjs/common';
import { AuthGRPCRepository } from './auth.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthRepository } from '../../app/repository/auth.repository';

@Module({
  imports: [
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
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthGRPCRepository,
    },
  ],
  exports: [AuthRepository],
})
export class RpcModule {}
