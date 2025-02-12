import { User } from 'libs/entities';

export abstract class UserRepository {
  abstract insertUser(user: User): Promise<User>;
  abstract getUserById(id: string): Promise<User>;
  abstract getUserByIds(ids: string[]): Promise<User[]>;
  abstract getUserByEmail(email: string): Promise<User>;
}
