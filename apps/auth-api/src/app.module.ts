import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { AuthModule } from './app/auth.module';

@Module({
  imports: [AuthModule, RepositoryModule],
})
export class AppModule {}
