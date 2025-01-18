import { Observable } from 'rxjs';
import { User } from '../core';
import { GoogleUser } from 'apps/auth-api/src/dto/auth.dto';

export interface AuthServiceClient {
  getUser: (body: { id: string }) => Observable<User>;
  validateOrCreateGoogleUser: (body: GoogleUser) => Observable<User>;
  getUsers: (body: { ids: string[] }) => Observable<{ users: User[] }>;
}
