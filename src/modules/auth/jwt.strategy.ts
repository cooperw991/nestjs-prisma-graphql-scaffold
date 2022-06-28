import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import { SecurityConfig } from '@/configs/config.interface';
import { JwtPayload } from '@Interface/jwt.interface';
import { GlobalPrismaClient } from '@Helper/prisma-client.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      ignoreExpiration: process.env.NODE_ENV !== 'development',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<SecurityConfig>('security').jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const prisma = GlobalPrismaClient.getInstance().prisma;

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
      },
    });
    return user;
  }
}
