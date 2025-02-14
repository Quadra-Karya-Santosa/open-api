import { Module } from '@nestjs/common';
import { UserPostgresRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreDB } from './core.db';
import { User } from 'libs/entities';
import { UserRepository } from '../../app/repository/user.respository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: CoreDB }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPostgresRepository,
    },
  ],
  exports: [UserRepository],
})
export class PostgresModule {}
