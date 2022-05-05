import R from 'ramda';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';

import { PagingQuery } from '@Dto/paging-query.input';
import { pagingResponse, prismaPaging } from '@Util/pagination.util';
import { generateOrderOptions, generateWhereOptions } from '@Util/query.util';

import { Log } from '@prisma/client';
import { VersionConfig } from '@/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { NewLogInput } from '../dto/new-log.input';
import { LogsFindFilter } from '../dto/find-filter.input';
import { LogsFindOrder } from '../dto/find-order.input';
import { LogsWithPaging } from '../dto/paging.dto';

@Injectable()
export class LogService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly i18n: I18nRequestScopeService,
  ) {
    this.apiVersion = this.config.get<VersionConfig>('version').version;
  }

  public apiVersion: string;

  async findLog(logId: number): Promise<Log> {
    const log = this.prisma.log.findFirst({
      where: {
        id: logId,
      },
    });

    if (!log) {
      throw new NotFoundException(
        await this.i18n.t('general.NOT_FOUND', {
          args: {
            model: 'Log',
            condition: 'id',
            value: logId,
          },
        }),
      );
    }

    return log;
  }

  async findLogs(
    where: LogsFindFilter,
    order: LogsFindOrder[],
    paging: PagingQuery,
  ): Promise<LogsWithPaging> {
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

    const logs = await this.prisma.log.findMany(queryOptions);
    const totalCount = await this.prisma.log.count(queryOptions);

    return {
      logs,
      paging: pagingResponse(paging, totalCount),
    };
  }

  async createLog(input: NewLogInput): Promise<Log> {
    try {
      const newLog = this.prisma.log.create({
        data: {
          ...input,
          apiVersion: this.apiVersion,
        },
      });
      return newLog;
    } catch (e) {
      Logger.error(e.message);
      throw new InternalServerErrorException(
        await this.i18n.t('general.INTERNAL_SERVER_ERROR', {
          args: {
            action: await this.i18n.t('db.CREATE'),
            model: 'Log',
          },
        }),
      );
    }
  }
}
