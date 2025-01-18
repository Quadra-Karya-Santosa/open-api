import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'libs/entities/open-api';
import { Repository } from 'typeorm';
import { MessagePagingDTO } from '../dto/chat.dto';

@Injectable()
export class ChatRepository {
  @InjectRepository(Chat)
  private readonly repository: Repository<Chat>;

  insertChat = async (data: Chat) => {
    await this.repository.save(data);
  };

  getAllChat = async (paging: MessagePagingDTO) => {
    const { skip, limit } = paging;
    const [chats, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { chats, total };
  };
}
