import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'libs/entities';
import { Repository } from 'typeorm';

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

  getUserByEmail = async (email: string) => {
    return await this.repository.findOne({ where: { email } });
  };
}
