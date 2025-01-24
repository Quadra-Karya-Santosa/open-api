import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SeedsUserDTO {
  @ApiProperty({ type: 'string', default: '6285720021928' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ type: 'string', default: 'Password123!' })
  @IsString()
  password: string;
}
