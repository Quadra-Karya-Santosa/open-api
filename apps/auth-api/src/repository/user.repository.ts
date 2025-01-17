import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'libs/entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  insertUser = async (user: User) => {
    return await this.repository.save(user);
  };

  getUserById = async (id: string) => {
    return await this.repository.findOne({ where: { id } });
  };

  getUserByIds = async (ids: string[]) => {
    return await this.repository.find({ where: { id: In(ids) } });
  };

  getUserByEmail = async (email: string) => {
    return await this.repository.findOne({ where: { email } });
  };
}
