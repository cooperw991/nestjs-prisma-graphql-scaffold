import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@Module/user/models/user.model';

@ObjectType()
export class Managers {
  @Field(() => User, { nullable: true })
  createdBy: User;

  @Field(() => User, { nullable: true })
  modifiedBy: User;
}
