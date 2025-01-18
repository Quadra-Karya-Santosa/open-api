import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'libs/entities/open-api';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRepository {
  @InjectRepository(Chat)
  private readonly repository: Repository<Chat>;

  insertChat = async (data: Chat) => {
    await this.repository.save(data);
  };
}
