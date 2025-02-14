import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'libs/entities';
import { In, Repository } from 'typeorm';
import { UserRepository } from '../../app/repository/user.respository';

@Injectable()
export class UserPostgresRepository implements UserRepository {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  async insertUser(user: User) {
    return await this.repository.save(user);
  }

  async getUserById(id: string) {
    return await this.repository.findOne({ where: { id } });
  }

  async getUserByIds(ids: string[]) {
    return await this.repository.find({ where: { id: In(ids) } });
  }

  async getUserByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }
}
