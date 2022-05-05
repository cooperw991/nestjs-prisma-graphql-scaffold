import { Field, ObjectType } from '@nestjs/graphql';

import { BaseModel } from '@Model/base.model';
import { Role } from '@prisma/client';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String)
  username?: string;

  @Field(() => Role)
  role: Role;

  @Field(() => String)
  encryptPassword: string;
}
