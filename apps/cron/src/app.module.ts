import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreDB } from './_db/core.db';
import { SeedsUser, Telegram } from 'libs/entities/seeds';
import { SeedsUsecases } from './usecases/seeds.usecase';
import { SeedsUserRepository } from './repository/seeds-user.repository';
import { SeedsRepository } from './repository/seeds.repository';
import { CronRepository } from './repository/cron.repository';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { TelegramRegisterRepository } from './repository/telegram-register.repository';
import { SeedsTelegramRepository } from './repository/seeds-telegram.repository';
import { ThrottlerModule } from '@nestjs/throttler';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramPaymentRepository } from './repository/telegram-payment.repository';
import { TelegramSummaryRepository } from './repository/telegram-summary.repository';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 5,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),
    TypeOrmModule.forRootAsync({ useClass: CoreDB }),
    TypeOrmModule.forFeature([SeedsUser, Telegram]),
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      botName: 'Register Bot',
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    TelegrafModule.forRoot({
      botName: 'Payment Bot',
      token: process.env.TELEGRAM_BOT_PAYMENT_TOKEN,
    }),
    TelegrafModule.forRoot({
      botName: 'Summary Bot',
      token: process.env.TELEGRAM_BOT_SUMMARY_TOKEN,
    }),
  ],
  controllers: [SeedsUsecases],
  providers: [
    SeedsUserRepository,
    SeedsRepository,
    CronRepository,
    SchedulerRegistry,
    TelegramRegisterRepository,
    TelegramPaymentRepository,
    TelegramSummaryRepository,
    SeedsTelegramRepository,
    Logger,
  ],
  exports: [],
})
export class CronModule {}
