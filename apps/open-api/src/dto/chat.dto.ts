import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { MetaMessageDTO } from 'dto/dto/pagination.dto';
import { User } from 'libs/entities';

export class ChatDTO {
  @ApiProperty({ type: 'string' })
  public readonly id: string;

  @ApiProperty({ type: 'string' })
  public readonly message: string;

  @ApiProperty({ type: 'string' })
  public readonly createdAt: Date;

  @ApiProperty({ type: User })
  public readonly user: User;

  constructor(partial: Partial<ChatDTO>) {
    Object.assign(this, partial);
  }
}

export class ChatsDTO {
  @ApiProperty({ type: MetaMessageDTO })
  public readonly meta: MetaMessageDTO;

  @ApiProperty({ type: [ChatDTO] })
  public readonly chats: ChatDTO[];
}

export class MessagePagingDTO {
  @ApiProperty({ type: 'number', default: 0 })
  @Type(() => Number)
  @IsNumber()
  public readonly skip: number;

  @ApiProperty({ type: 'number', default: 10 })
  @Type(() => Number)
  @IsNumber()
  public readonly limit: number;
}
