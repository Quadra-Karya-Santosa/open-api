import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class PagingDTO {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({ default: 10 })
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @ApiProperty({ default: '', nullable: true })
  @IsString()
  @IsOptional()
  search: string;
}

export class MetaDTO {
  @ApiProperty()
  @IsNumber()
  public readonly total: number;

  @ApiProperty()
  @IsNumber()
  public readonly page: number;

  @ApiProperty()
  @IsNumber()
  public readonly limit: number;

  @ApiProperty()
  @IsNumber()
  public readonly lastPage: number;

  @ApiProperty()
  @IsBoolean()
  public readonly hasPreviousPage: boolean;

  @ApiProperty()
  @IsBoolean()
  public readonly hasNextPage: boolean;
}
