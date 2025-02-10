import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeedsUser } from 'libs/entities/seeds';
import { Repository } from 'typeorm';

@Injectable()
export class SeedsUserRepository {
  @InjectRepository(SeedsUser)
  private readonly repository: Repository<SeedsUser>;

  createUser = async (data: SeedsUser) => {
    await this.repository.save(data);
  };

  getUserByPhone = async (phoneNumber: string) => {
    return await this.repository.findOne({ where: { phoneNumber } });
  };

  getAllUser = async () => {
    return await this.repository.find();
  };
}
