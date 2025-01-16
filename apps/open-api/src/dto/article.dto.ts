import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MetaDTO } from 'dto/dto/pagination.dto';
import { Article } from 'libs/entities/open-api';

export class CreateArticleDTO {
  @ApiProperty({ default: '' })
  @IsString()
  public readonly title: string;

  @ApiProperty({ default: '' })
  @IsString()
  public readonly content: string;
  @ApiProperty({ default: '' })
  @IsString()
  public readonly author: string;
}

export class ArticlesDTO {
  @ApiProperty({ type: MetaDTO })
  public readonly meta: MetaDTO;

  @ApiProperty({ type: [Article] })
  public readonly articles: Article[];
}
