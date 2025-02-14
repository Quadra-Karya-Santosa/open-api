import { AuthRepository } from '../../app/repository/auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'libs/entities';

export class AuthPostgresRepository extends AuthRepository {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  async getDataUserById(id: string) {
    return await this.repository.findOne({ where: { id } });
  }
}
