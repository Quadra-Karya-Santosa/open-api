import { Observable } from 'rxjs';
import { User } from '../core';

export interface AuthServiceClient {
  getUser: (body: { id: string }) => Observable<User>;
}
