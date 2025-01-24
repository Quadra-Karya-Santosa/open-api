import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SeedsUserRepository } from './seeds-user.repository';
import { SeedsRepository } from './seeds.repository';

@Injectable()
export class CronRepository {
  constructor(
    private readonly seedsUserRepo: SeedsUserRepository,
    private readonly seedsRepo: SeedsRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11AM, {
    name: 'seeds-activity',
    timeZone: 'Asia/Jakarta',
  })
  async triggerActivity() {
    try {
      console.log('🕚 Cron running');
      const users = await this.seedsUserRepo.getAllUser();
      const promises: Promise<void>[] = [];
      users.forEach((user) => {
        promises.push(
          this.seedsRepo.activityJob({
            phoneNumber: user.phoneNumber,
            password: user.password,
          }),
        );
      });
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  }
}
