import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAuthHelper } from './auth.helper';
import { User } from 'libs/entities';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user') {
  @Inject(UserAuthHelper)
  private readonly helper: UserAuthHelper;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: true,
    });
  }

  public async validate(payload: string): Promise<User | never> {
    const user = await this.helper.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
