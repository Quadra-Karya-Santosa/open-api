import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ArticlesDTO, CreateArticleDTO } from '../dto/article.dto';
import { MetaDTO, PagingDTO } from 'dto/dto/pagination.dto';
import { ArticleRepository } from '../repository/article.repository';
import { User } from 'libs/entities';
import { Article } from 'libs/entities/open-api';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Article')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('article')
export class ArticleUsecases {
  constructor(private readonly articleRepository: ArticleRepository) {}

  @ApiResponse({
    status: 201,
    description: 'Create article success.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when create article, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this api",
  })
  @UseGuards(AuthGuard('user'))
  @Post('')
  async createArticle(
    @Body() body: CreateArticleDTO,
    @Req() req: any,
  ): Promise<void> {
    const user: User = req.user;
    try {
      const { title, content, author } = body;
      const article = new Article({
        title,
        content,
        author,
        ownerId: user.id,
      });
      await this.articleRepository.insertArticle(article);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when create article, contact dionisiusadityaoctanugraha@gmail.com',
      );
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Update article success.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when update article, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this api",
  })
  @ApiForbiddenResponse({
    description: "You don't have permission to delete this data",
  })
  @UseGuards(AuthGuard('user'))
  @Put('/:id')
  async updateArticle(
    @Body() body: CreateArticleDTO,
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<void> {
    const user: User = req.user;
    const { title, content, author } = body;
    try {
      const exist = await this.articleRepository.getArticleById(id, user.id);
      if (!exist) {
        throw new ForbiddenException();
      }
      const article = new Article({
        title,
        content,
        author,
      });
      await this.articleRepository.updateArticle(id, user.id, article);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when update article, contact dionisiusadityaoctanugraha@gmail.com',
      );
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Delete article success.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when delete article, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this api",
  })
  @ApiForbiddenResponse({
    description: "You don't have permission to delete this data",
  })
  @UseGuards(AuthGuard('user'))
  @Delete('/:id')
  async deleteArticle(@Param('id') id: string, @Req() req: any): Promise<void> {
    const user: User = req.user;
    try {
      const exist = await this.articleRepository.getArticleById(id, user.id);
      if (!exist) {
        throw new ForbiddenException();
      }
      await this.articleRepository.deleteArticle(id, user.id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when update article, contact dionisiusadityaoctanugraha@gmail.com',
      );
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Get article success.',
    type: [ArticlesDTO],
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when get article list, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this api",
  })
  @UseGuards(AuthGuard('user'))
  @Get('/')
  async getArticles(
    @Query() pagination: PagingDTO,
    @Req() req: any,
  ): Promise<ArticlesDTO> {
    const user: User = req.user;
    try {
      const { page, limit } = pagination;
      const { total, articles } =
        await this.articleRepository.getArticleByUserId(user.id, pagination);

      const lastPage = Math.ceil(total / limit);
      const hasPreviousPage = page > 1;
      const hasNextPage = page < lastPage;

      const meta: MetaDTO = {
        total,
        page,
        limit,
        lastPage,
        hasPreviousPage,
        hasNextPage,
      };

      return {
        articles,
        meta,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when get all article, contact dionisiusadityaoctanugraha@gmail.com',
      );
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Get article success.',
    type: [ArticlesDTO],
  })
  @ApiNotFoundResponse({
    description: 'Article not found',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Error occured when get article list, contact dionisiusadityaoctanugraha@gmail.com',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this api",
  })
  @UseGuards(AuthGuard('user'))
  @Get('/:id')
  async getArticleById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Article> {
    const user: User = req.user;
    try {
      const article = await this.articleRepository.getArticleById(id, user.id);
      if (!article)
        throw new NotFoundException(`Article with id ${id} not found`);
      return article;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured when get all article, contact dionisiusadityaoctanugraha@gmail.com',
      );
    }
  }
}
