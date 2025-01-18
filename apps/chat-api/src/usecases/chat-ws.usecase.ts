import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'auth/auth/user/ws.guard';
import { ChatRepository } from '../repository/chat.repository';
import { Chat } from 'libs/entities/open-api';
import { AsyncApiPub } from 'nestjs-asyncapi';
import { CreateMessageDTO } from '../dto/chat.dto';

@WebSocketGateway()
@UseGuards(WsJwtGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatRepository: ChatRepository) {}

  @SubscribeMessage('sendMessage')
  @AsyncApiPub({
    channel: 'sendMessge',
    message: {
      payload: CreateMessageDTO,
    },
  })
  async handleMessage(
    @MessageBody('message') message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client as any).user;
    const chat = new Chat({
      message,
      ownerId: user.id,
    });
    await this.chatRepository.insertChat(chat);
    this.server.emit('newMessage', { user, message });
  }
}
