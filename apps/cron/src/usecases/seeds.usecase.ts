import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  Inject,
  Logger,
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
  ApiExcludeEndpoint,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SeedsUserDTO } from '../dto/user.dto';
import { SeedsUser, Telegram } from 'libs/entities/seeds';
import { SeedsRepository } from '../repository/seeds.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronRepository } from '../repository/cron.repository';
import { ChatDTO, RegisterTelegramDTO } from '../dto/seeds.dto';
import { TelegramRepository } from '../repository/telegram.repository';
import { SeedsTelegramRepository } from '../repository/seeds-telegram.repository';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Telegram BOT')
@Controller('')
export class SeedsUsecases {
  @Inject(CronRepository)
  private readonly service: CronRepository;

  constructor(
    private readonly seedsUserRepo: SeedsUserRepository,
    private readonly seedsRepo: SeedsRepository,
    private readonly telegramRepo: TelegramRepository,
    private readonly seedsTelegramRepo: SeedsTelegramRepository,
    private schedulerRegistry: SchedulerRegistry,
    private readonly logger: Logger,
  ) {}

  @ApiExcludeEndpoint()
  @ApiResponse({
    status: 201,
    description: 'Create cron user success.',
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

  @ApiExcludeEndpoint()
  @ApiResponse({
    status: 201,
    description: 'Register telegram account success.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when create data, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiConflictResponse({
    description: 'Chat id registered',
  })
  @ApiBadRequestResponse({
    description: 'Request body possibly wrong',
  })
  @Post('/register-telegram-account')
  async registerTelegramId(@Body() body: RegisterTelegramDTO) {
    try {
      const { chatId, name } = body;
      const exist = await this.seedsTelegramRepo.getByTelegramId(
        chatId.toString(),
      );
      if (exist)
        throw new ConflictException(
          `Telegram chat id already registered as ${exist.name}`,
        );
      const telegram = new Telegram({ chatId: chatId.toString(), name });
      await this.seedsTelegramRepo.createTelegram(telegram);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Get all telegram account success.',
    type: [Telegram],
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when get data, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @Get('/telegram-accounts')
  async getAllTelegram() {
    return await this.seedsTelegramRepo.getAllTelegram();
  }

  @Post('/send-telegram-message')
  async getCronStatus(@Body() body: ChatDTO) {
    const { message } = body;
    const telegrams = await this.seedsTelegramRepo.getAllTelegram();
    const uniqueId = telegrams.map((item) => +item.chatId);

    return await this.telegramRepo.sendMessage(message, uniqueId);
  }
}
