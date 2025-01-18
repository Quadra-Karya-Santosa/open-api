import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDTO } from 'dto/dto/pagination.dto';
import { Article } from 'libs/entities/open-api';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository {
  @InjectRepository(Article)
  private readonly repository: Repository<Article>;

  insertArticle = async (data: Article) => {
    await this.repository.save(data);
  };

  updateArticle = async (
    id: string,
    ownerId: string,
    data: Partial<Article>,
  ) => {
    await this.repository.update({ ownerId, id }, data);
  };

  deleteArticle = async (id: string, ownerId: string) => {
    await this.repository.delete({ id, ownerId });
  };

  getArticleById = async (id: string) => {
    return await this.repository.findOne({ where: { id } });
  };

  getUserArticleById = async (id: string, ownerId: string) => {
    return await this.repository.findOne({ where: { id, ownerId } });
  };

  getArticleByUserId = async (pagination: PagingDTO) => {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const [articles, total] = await this.repository.findAndCount({
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    return { articles, total };
  };
}
