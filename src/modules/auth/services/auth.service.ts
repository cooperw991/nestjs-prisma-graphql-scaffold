import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { User } from '@prisma/client';
import { JwtPayload, AccessToken } from '@Interface/jwt.interface';
import { SecurityConfig } from '@/configs/config.interface';
import { UserService } from '@Module/user/services/user.service';
import { UserWithJWT } from '../dto/user-with-jwt.object';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private i18n: I18nRequestScopeService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<User> {
    const now = dayjs();
    const expiration = dayjs.unix(payload.exp);
    const user = await this.userService.findUser(payload.id);
    if (!user || !now.isBefore(expiration)) {
      throw new UnauthorizedException(this.i18n.t('general.UNAUTHENTICATED'));
    }
    return user;
  }

  async signIn(phone: string, password: string): Promise<UserWithJWT> {
    const user = await this.userService.findUserByPhone(phone);

    const valid = await this.authenticateUser(user, password);

    if (!valid) {
      throw new ForbiddenException(
        await this.i18n.t('user.PASSWORD_INCORRECT'),
      );
    }

    const token = this.createToken(user);
    return Object.assign(user, {
      jwt: token.jwt,
    });
  }

  async authenticateUser(user: User, password: string): Promise<boolean> {
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.encryptPassword);
  }

  createToken(user: User): AccessToken {
    const securityConf = this.config.get<SecurityConfig>('security');
    return {
      jwt: sign({ id: user.id }, securityConf.jwtSecret, {
        expiresIn: securityConf.expiresIn,
      }),
    };
  }
}
