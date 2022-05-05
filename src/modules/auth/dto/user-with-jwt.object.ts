import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@Module/user/models/user.model';

@ObjectType()
export class UserWithJWT extends User {
  @Field()
  jwt: string;
}
