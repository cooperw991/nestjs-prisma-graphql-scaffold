import { Field, ObjectType } from '@nestjs/graphql';
import { PagingInfo } from '@Dto/paging-info.dto';
import { LogModel } from '@Module/log/models/log.model';

@ObjectType()
export class LogsWithPaging {
  @Field(() => [LogModel])
  logs: LogModel[];

  @Field(() => PagingInfo)
  paging: PagingInfo;
}
