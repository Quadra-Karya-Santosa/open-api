import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAuthHelper } from './auth.helper';
import { User } from 'libs/entities';
import { Request } from 'express';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user') {
  @Inject(UserAuthHelper)
  private readonly helper: UserAuthHelper;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        UserJwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies && req.cookies.token.length > 0) {
      return req.cookies.token;
    }
    return null;
  }

  public async validate(payload: string): Promise<User | never> {
    const user = await this.helper.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
