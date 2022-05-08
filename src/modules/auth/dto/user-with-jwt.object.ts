import { Field, ObjectType } from '@nestjs/graphql';

import { UserModel } from '@Module/user/models/user.model';

@ObjectType()
export class UserWithJWT extends UserModel {
  @Field()
  jwt: string;
}
