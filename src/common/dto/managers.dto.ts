import { Field, ObjectType } from '@nestjs/graphql';

import { UserModel } from '@Module/user/models/user.model';

@ObjectType()
export class Managers {
  @Field(() => UserModel, { nullable: true })
  createdBy: UserModel;

  @Field(() => UserModel, { nullable: true })
  modifiedBy: UserModel;
}
