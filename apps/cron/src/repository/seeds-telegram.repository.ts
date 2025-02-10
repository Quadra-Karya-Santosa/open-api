import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Telegram } from 'libs/entities/seeds';
import { Repository } from 'typeorm';

@Injectable()
export class SeedsTelegramRepository {
  @InjectRepository(Telegram)
  private readonly repository: Repository<Telegram>;

  createTelegram = async (data: Telegram) => {
    await this.repository.save(data);
  };

  getAllTelegram = async () => {
    return await this.repository.find();
  };

  getByTelegramId = async (id: string) => {
    return await this.repository.findOne({ where: { chatId: id } });
  };
}
