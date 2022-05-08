import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '@Guard/auth.guard';
import { UserEntity } from '@Decorator/user.decorator';
import { PagingQuery } from '@Dto/paging-query.input';
import { UserModel } from '@Module/user/models/user.model';
import { LogModel } from '../models/log.model';
import { LogsFindFilter } from '../dto/find-filter.input';
import { LogsFindOrder } from '../dto/find-order.input';
import { LogsWithPaging } from '../dto/paging.dto';
import { LogService } from '../services/log.service';

@Resolver(() => LogModel)
export class LogResolver {
  constructor(private logService: LogService) {}

  @Query(() => LogModel)
  async findLog(
    @UserEntity() me: UserModel,
    @Args({ name: 'logId', type: () => Int }) logId: number,
  ): Promise<LogModel> {
    return this.logService.findLog(logId);
  }

  @Query(() => LogsWithPaging)
  @UseGuards(GqlAuthGuard)
  async findLogs(
    @UserEntity() me: UserModel,
    @Args({ name: 'where', type: () => LogsFindFilter, nullable: true })
    where: LogsFindFilter,
    @Args({ name: 'order', type: () => [LogsFindOrder], nullable: true })
    order: LogsFindOrder[],
    @Args({ name: 'paging', type: () => PagingQuery, nullable: true })
    paging: PagingQuery,
  ): Promise<LogsWithPaging> {
    return this.logService.findLogs(where, order, paging);
  }
}
