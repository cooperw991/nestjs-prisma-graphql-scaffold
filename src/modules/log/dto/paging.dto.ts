import { Field, ObjectType } from '@nestjs/graphql';
import { PagingInfo } from '@Dto/paging-info.dto';
import { Log } from '@Module/log/models/log.model';

@ObjectType()
export class LogsWithPaging {
  @Field(() => [Log])
  logs: Log[];

  @Field(() => PagingInfo)
  paging: PagingInfo;
}
