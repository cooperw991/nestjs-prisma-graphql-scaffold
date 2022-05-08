import { Field, ObjectType } from '@nestjs/graphql';
import { PagingInfo } from '@Dto/paging-info.dto';
import { UserModel } from '@Module/user/models/user.model';

@ObjectType()
export class UsersWithPaging {
  @Field(() => [UserModel])
  users: UserModel[];

  @Field(() => PagingInfo)
  paging: PagingInfo;
}
