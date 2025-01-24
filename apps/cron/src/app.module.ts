import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreDB } from './_db/core.db';
import { SeedsUser } from 'libs/entities/seeds';
import { SeedsUsecases } from './usecases/seeds.usecase';
import { SeedsUserRepository } from './repository/seeds-user.repository';
import { SeedsRepository } from './repository/seeds.repository';
import { CronRepository } from './repository/cron.repository';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: CoreDB }),
    TypeOrmModule.forFeature([SeedsUser]),
    ScheduleModule.forRoot(),
  ],
  controllers: [SeedsUsecases],
  providers: [
    SeedsUserRepository,
    SeedsRepository,
    CronRepository,
    SchedulerRegistry,
  ],
  exports: [],
})
export class CronModule {}
