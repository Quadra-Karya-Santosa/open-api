import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDTO {
  public readonly message: string;
}

export class CreateMessageDTO {
  @ApiProperty({ type: SendMessageDTO })
  payload: SendMessageDTO;
}
