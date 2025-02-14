import { User } from 'libs/entities';

export abstract class AuthRepository {
  abstract getDataUserById(id: string): Promise<User>;
}
