import R from 'ramda';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { I18nRequestScopeService } from 'nestjs-i18n';
import bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SecurityConfig } from '@/configs/config.interface';
import { PagingQuery } from '@Dto/paging-query.input';
import { pagingResponse, prismaPaging } from '@Util/pagination.util';
import { generateOrderOptions, generateWhereOptions } from '@Util/query.util';

import { LogService } from '@Module/log/services/log.service';
import { Role, User } from '@prisma/client';
import { NewUserInput } from '../dto/new-user.input';
import { EditUserInput } from '../dto/edit-user.input';
import { UsersFindFilter } from '../dto/find-filter.input';
import { UsersFindOrder } from '../dto/find-order.input';
import { UsersWithPaging } from '../dto/paging.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
    private config: ConfigService,
    private i18n: I18nRequestScopeService,
  ) {
    this.moduleName = 'user';
  }

  public moduleName: string;

  async findUser(userId: number): Promise<User> {
    const user = this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException(
        await this.i18n.t('general.NOT_FOUND', {
          args: {
            model: 'User',
            condition: 'id',
            value: userId,
          },
        }),
      );
    }

    return user;
  }

  async findUserByPhone(phone: string): Promise<User> {
    const user = this.prisma.user.findFirst({
      where: {
        phone,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException(
        await this.i18n.t('general.NOT_FOUND', {
          args: {
            model: 'User',
            condition: 'phone',
            value: phone,
          },
        }),
      );
    }

    return user;
  }

  async findUsers(
    where: UsersFindFilter,
    order: UsersFindOrder[],
    paging: PagingQuery,
  ): Promise<UsersWithPaging> {
    const queryOptions: any = {};
    const whereOptions = generateWhereOptions(where);
    const orderOptions = generateOrderOptions(order);

    if (!R.isEmpty(whereOptions)) {
      queryOptions.where = whereOptions;
    }

    if (orderOptions.length) {
      queryOptions.orderBy = orderOptions;
    }

    const { skip, take } = prismaPaging(paging);
    queryOptions.skip = skip;
    queryOptions.take = take;

    const users = await this.prisma.user.findMany(queryOptions);
    const totalCount = await this.prisma.user.count(queryOptions);

    return {
      users,
      paging: pagingResponse(paging, totalCount),
    };
  }

  async createUser(input: NewUserInput, myId: number): Promise<User> {
    await this.checkConfilct({
      phone: input.phone,
    } as User);

    const securityConfig = this.config.get<SecurityConfig>('security');
    const encryptPassword = await bcrypt.hash(
      input.password,
      securityConfig.bcryptSaltOrRound,
    );

    let newUser;

    try {
      newUser = this.prisma.user.create({
        data: {
          ...R.dissoc('password', input),
          encryptPassword,
          role: Role.ADMIN,
          creatorId: myId,
          modifierId: myId,
        },
      });
    } catch (e) {
      Logger.error(e.message);
      throw new InternalServerErrorException(
        await this.i18n.t('general.INTERNAL_SERVER_ERROR', {
          args: {
            action: await this.i18n.t('db.CREATE'),
            model: 'User',
          },
        }),
      );
    }

    await this.logService.createLog({
      userId: myId,
      moduleName: this.moduleName,
      action: 'create',
      additionalContent: JSON.stringify(input),
    });

    return newUser;
  }

  async updateUser(
    userId: number,
    input: EditUserInput,
    myId: number,
  ): Promise<User> {
    const { phone } = input;
    const user = await this.findUser(userId);

    const toCheck = {};

    if (phone && user.phone !== phone) {
      toCheck['phone'] = phone;
    }

    if (!R.isEmpty(toCheck)) {
      await this.checkConfilct(toCheck as User);
    }

    let newUser;

    try {
      newUser = this.prisma.user.update({
        data: {
          ...R.dissoc('password', input),
          modifierId: myId,
        },
        where: {
          id: userId,
        },
      });
    } catch (e) {
      Logger.error(e.message);
      throw new InternalServerErrorException(
        await this.i18n.t('general.INTERNAL_SERVER_ERROR', {
          args: {
            action: await this.i18n.t('db.UPDATE'),
            model: 'User',
          },
        }),
      );
    }

    await this.logService.createLog({
      userId: myId,
      moduleName: this.moduleName,
      action: 'update',
      additionalContent: JSON.stringify(input),
    });

    return newUser;
  }

  async deleteUser(userId: number, myId: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return true;
    }

    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      await this.prisma.user.update({
        data: {
          modifierId: myId,
        },
        where: {
          id: userId,
        },
      });
    } catch (e) {
      Logger.error(e.message);
      throw new InternalServerErrorException(
        await this.i18n.t('general.INTERNAL_SERVER_ERROR', {
          args: {
            action: await this.i18n.t('db.DELETE'),
            model: 'User',
          },
        }),
      );
    }

    await this.logService.createLog({
      userId: myId,
      moduleName: this.moduleName,
      action: 'delete',
      additionalContent: JSON.stringify({}),
    });

    return true;
  }

  async checkConfilct(userEntity: User) {
    const { phone } = userEntity;
    const user = await this.prisma.user.findFirst({
      where: {
        phone,
        deletedAt: null,
      },
    });

    if (user) {
      throw new ConflictException(await this.i18n.t('user.PHONE_CONFLICT'));
    }
  }
}
