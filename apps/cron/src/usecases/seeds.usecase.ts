import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { SeedsUserRepository } from '../repository/seeds-user.repository';
import {
  ApiResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SeedsUserDTO } from '../dto/user.dto';
import { SeedsUser } from 'libs/entities/seeds';
import { SeedsRepository } from '../repository/seeds.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronRepository } from '../repository/cron.repository';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class SeedsUsecases {
  @Inject(CronRepository)
  private readonly service: CronRepository;

  constructor(
    private readonly seedsUserRepo: SeedsUserRepository,
    private readonly seedsRepo: SeedsRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Create article success.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when create seeds data, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiConflictResponse({
    description: 'Phone number already registered for cron process',
  })
  @ApiUnauthorizedResponse({
    description: 'Your seeds credentials possibly wrong',
  })
  @Post('/initial-cron')
  async createArticle(@Body() body: SeedsUserDTO): Promise<any> {
    const { phoneNumber, password } = body;
    const loginRes = await this.seedsRepo.getUserToken(body);
    if (!loginRes)
      throw new UnauthorizedException('Wrong seeds phone number or password');

    const exist = await this.seedsUserRepo.getUserByPhone(phoneNumber);
    if (exist) throw new ConflictException('Phone number already registered');

    const user = new SeedsUser({ phoneNumber, password });
    await this.seedsUserRepo.createUser(user);

    return await this.seedsRepo.activityJob(body);
  }

  @Get('/cron-status')
  async getCronStatus() {
    const seedsActivity = this.schedulerRegistry.getCronJob('seeds-activity');
    return seedsActivity.lastDate();
  }
}
