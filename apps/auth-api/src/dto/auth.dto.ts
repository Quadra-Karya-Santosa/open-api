import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { PagingDTO } from 'dto/dto/pagination.dto';
import { User } from 'libs/entities';

export class GetSupportDTO extends PagingDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string = 'pending';
}

export class RegisterDTO {
  @ApiProperty({ default: 'John Doe' })
  @IsString()
  public readonly name: string;

  @ApiProperty({ default: 'collaborator@gmail.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ default: 'Password123!' })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  public readonly password: string;
}

export class LoginDTO {
  @ApiProperty({ default: 'collaborator@gmail.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ default: 'Password123!' })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  public readonly password: string;
}

export class AuthenticationDTO {
  @ApiProperty({ type: 'string' })
  public readonly token: string;

  @ApiProperty({ type: User })
  public readonly user: User;
}

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}
