import { Field, ObjectType } from '@nestjs/graphql';

import { BaseModel } from '@Model/base.model';
import { Role } from '@prisma/client';

@ObjectType()
export class UserModel extends BaseModel {
  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String)
  username: string | null;

  @Field(() => Role)
  role: Role;

  @Field(() => String)
  encryptPassword: string;
}
