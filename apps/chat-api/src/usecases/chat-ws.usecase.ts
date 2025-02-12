import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'auth/auth/user/ws.guard';
import { ChatRepository } from '../repository/chat.repository';
import { Chat } from 'libs/entities/open-api';
import { AuthRepository } from '../repository/auth.repository';
import { WebsocketExceptionsFilter } from '../helper/ws-exception';

@WebSocketGateway()
@UseGuards(WsJwtGuard)
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatRepository: ChatRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  @SubscribeMessage('sendMessage')
  // @AsyncApiPub({
  //   channel: 'sendMessge',
  //   message: {
  //     payload: CreateMessageDTO,
  //   },
  // })
  async handleMessage(
    @MessageBody('message') message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userContext = (client as any).user;
    const chat = new Chat({
      message,
      ownerId: userContext.id,
    });
    const users = await this.authRepository.getUsers([userContext.id]);
    const user = users[0];
    const newChat = await this.chatRepository.insertChat(chat);
    this.server.emit('newMessage', {
      id: newChat.id,
      message: newChat.message,
      createdAt: newChat.createdAt,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: 'user',
      },
    });
  }
}
