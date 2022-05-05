import { Field, ObjectType } from '@nestjs/graphql';
import { PagingInfo } from '@Dto/paging-info.dto';
import { User } from '@Module/user/models/user.model';

@ObjectType()
export class UsersWithPaging {
  @Field(() => [User])
  users: User[];

  @Field(() => PagingInfo)
  paging: PagingInfo;
}
