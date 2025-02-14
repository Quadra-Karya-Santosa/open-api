import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MetaMessageDTO } from 'dto/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChatRepository } from '../repository/chat.repository';
import { ChatDTO, ChatsDTO, MessagePagingDTO } from '../dto/chat.dto';
import { AuthRepository } from '../repository/auth.repository';
import { User } from 'libs/entities';

@ApiTags('Chat')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('chat')
export class ChatUsecases {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Get chats success.',
    type: [ChatsDTO],
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when get chat list, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this api",
  })
  @UseGuards(AuthGuard('user'))
  @Get('/')
  async getChats(@Query() pagination: MessagePagingDTO): Promise<ChatsDTO> {
    try {
      const { skip, limit } = pagination;
      const { total, chats } = await this.chatRepository.getAllChat(pagination);
      const lastPage = Math.ceil(total / limit);
      const hasPreviousPage = skip !== 0;
      const hasNextPage = skip + limit < total;
      const meta: MetaMessageDTO = {
        total,
        skip,
        limit,
        lastPage,
        hasPreviousPage,
        hasNextPage,
      };

      if (chats.length === 0) {
        return {
          chats: [],
          meta,
        };
      }

      const ids = chats.map((chat) => chat.ownerId);
      const users = await this.authRepository.getUsers(ids);
      const userMap: Map<string, User> = new Map();
      users.forEach((user) => {
        userMap.set(user.id, user);
      });

      const chatWithUser: ChatDTO[] = chats.map((item) => {
        const user = userMap.get(item.ownerId);
        const chat = new ChatDTO({
          id: item.id,
          message: item.message,
          createdAt: item.createdAt,
          user,
        });
        return chat;
      });

      return {
        chats: chatWithUser,
        meta,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when get all article, contact dionisiusadityaoctanugraha@gmail.com',
      );
    }
  }
}
