import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { RpcModule } from './rpc/rpc.module';

@Module({
  imports: [PostgresModule, RpcModule],
  exports: [PostgresModule, RpcModule],
})
export class RepositoryModule {}
